// supabase/functions/send-nurturing-emails/index.ts
// Edge Function pour envoyer les emails de la séquence éducative (nurturing)
// Déclenchée via pg_cron tous les jours à 10h UTC

import { supabase, APP_BASE_URL } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'
import { translations } from '../../utils/i18n.ts'

interface NurturingTarget {
  id: string
  email: string
  locale: string
  next_step: number
  profile_id: string | null
  enrolled_at: string
}

interface NurturingConfig {
  step1_delay_days: number
  step2_delay_days: number
  step3_delay_days: number
  step1_article_slug: string
  step2_article_slug: string
  step3_page_path: string
  batch_size: number
}

// ============================================================
// HANDLER
// ============================================================

Deno.serve(
  createHandler(async () => {
    console.log('📚 Envoi des emails de séquence éducative (nurturing)...')

    // 1. Vérifier si le système est activé
    const { data: settings, error: settingsError } = await supabase
      .from('auto_promo_settings')
      .select('setting_value, is_enabled')
      .eq('setting_key', 'email_nurturing')
      .single()

    if (settingsError) {
      console.error('Erreur récupération settings:', settingsError)
      throw settingsError
    }

    if (!settings?.is_enabled) {
      console.log('❌ Séquence éducative désactivée')
      return { success: true, message: 'Nurturing disabled', sent: 0 }
    }

    const config = settings.setting_value as NurturingConfig

    // 2. Récupérer les emails à envoyer
    const { data: targets, error: targetsError } = await supabase.rpc('find_nurturing_emails_to_send')

    if (targetsError) {
      console.error('Erreur recherche cibles:', targetsError)
      throw targetsError
    }

    if (!targets || targets.length === 0) {
      console.log('✅ Aucun email nurturing à envoyer')
      return { success: true, message: 'No emails to send', sent: 0 }
    }

    console.log(`📧 ${targets.length} email(s) à envoyer`)

    // 3. Traiter chaque cible
    const results: Array<{
      email: string
      step: number
      success: boolean
      error?: string
    }> = []

    for (const target of targets as NurturingTarget[]) {
      try {
        const locale = (target.locale || 'fr') as 'fr' | 'en'
        const optoutUrl = `${APP_BASE_URL}/emails/optout?type=nurturing&email=${encodeURIComponent(target.email)}`

        // Déterminer l'URL de l'article selon le step
        let articleUrl: string
        let emailType: string
        let subject: string

        switch (target.next_step) {
          case 1:
            articleUrl = `${APP_BASE_URL}/lab-notes/${config.step1_article_slug}`
            emailType = 'nurturing_step1'
            subject = translations.nurturing.step1.subject[locale]
            break
          case 2:
            articleUrl = `${APP_BASE_URL}/lab-notes/${config.step2_article_slug}`
            emailType = 'nurturing_step2'
            subject = translations.nurturing.step2.subject[locale]
            break
          case 3:
            articleUrl = `${APP_BASE_URL}${config.step3_page_path}`
            emailType = 'nurturing_step3'
            subject = translations.nurturing.step3.subject[locale]
            break
          default:
            throw new Error(`Invalid step: ${target.next_step}`)
        }

        // Générer le HTML de l'email
        const html = renderEmailTemplate(emailType, {
          locale,
          optout_url: optoutUrl,
          article_url: articleUrl,
        })

        // Envoyer l'email
        await sendEmail({
          to: target.email,
          subject,
          html,
          type: emailType,
        })

        // Marquer comme envoyé dans la base
        const { data: markResult } = await supabase.rpc('mark_nurturing_email_sent', {
          p_id: target.id,
          p_step: target.next_step,
        })

        if (markResult) {
          console.log(`✅ Email step ${target.next_step} envoyé à ${target.email}`)
          results.push({ email: target.email, step: target.next_step, success: true })
        } else {
          console.warn(`⚠️ Email envoyé mais marquage échoué pour ${target.email}`)
          results.push({ email: target.email, step: target.next_step, success: true })
        }
      } catch (err) {
        console.error(`❌ Erreur envoi ${target.email}:`, err)
        results.push({
          email: target.email,
          step: target.next_step,
          success: false,
          error: String(err),
        })
      }
    }

    const sentCount = results.filter((r) => r.success).length
    const failedCount = results.length - sentCount

    console.log(`📊 Résultat: ${sentCount} envoyés, ${failedCount} échoués`)

    return {
      success: true,
      message: `Processed ${results.length} nurturing emails`,
      sent: sentCount,
      failed: failedCount,
      results,
    }
  }),
)
