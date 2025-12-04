// supabase/functions/generate-chat-suggestion/index.ts

import { createHandler } from '../../utils/createHandler.ts'

// Choix du provider : 'anthropic' ou 'openai'
const AI_PROVIDER = Deno.env.get('AI_PROVIDER') ?? 'anthropic'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

interface ChatMessage {
  role: 'user' | 'admin'
  content: string
  created_at?: string
}

interface SuggestionRequestBody {
  messages: ChatMessage[]
  clientEmail?: string
}

const SYSTEM_PROMPT = `Tu es un assistant de support client pour Fast Peptides, un fournisseur européen de peptides de recherche.
Tu aides l'agent humain (admin) à rédiger des réponses professionnelles aux clients.

CONTEXTE BUSINESS :
- Nous vendons des peptides exclusivement pour la recherche en laboratoire (Research Use Only - RUO)
- Nos produits NE SONT PAS destinés à un usage humain ou vétérinaire
- Nous fournissons des certificats d'analyse (CoA) avec chaque lot

RÈGLES DE SÉCURITÉ STRICTES :
1. Si le client mentionne une condition médicale, une blessure, un dosage, une injection, une posologie, ou tout usage corporel :
   → Tu DOIS générer une réponse de refus poli rappelant que nos produits sont uniquement destinés à la recherche en laboratoire et que nous ne pouvons pas donner de conseils médicaux, de dosage ou d'administration.

2. Ne JAMAIS suggérer :
   - Des dosages ou posologies
   - Des méthodes d'administration ou d'injection
   - Des conseils de santé ou médicaux
   - Des usages thérapeutiques

POUR LES QUESTIONS AUTORISÉES :
- Questions logistiques (livraison, colis, suivi) : Réponse claire et utile
- Questions sur les produits (pureté, certificats, stock) : Réponse informative
- Questions sur les commandes (paiement, facture) : Réponse professionnelle
- Questions techniques (conservation, stockage en labo) : Réponse factuelle

TON ET STYLE :
- Professionnel, concis et courtois
- Réponses en français
- Tutoiement ou vouvoiement selon le contexte du client
- Maximum 2-3 phrases pour les réponses simples

Tu génères UNIQUEMENT le texte de la réponse suggérée, sans préambule ni explication.`

/**
 * Formate l'historique des messages pour OpenAI
 */
function formatMessagesForOpenAI(
  messages: ChatMessage[],
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }))
}

/**
 * Appel à l'API Anthropic (Claude)
 */
async function callAnthropic(
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<{ suggestion: string; tokensUsed: number }> {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.content,
  }))

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 300,
      system: systemPrompt,
      messages: formattedMessages,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Anthropic API error:', errorText)
    throw new Error(`Erreur Anthropic: ${response.status}`)
  }

  const data = await response.json()
  const suggestion = data.content?.[0]?.text?.trim()

  return {
    suggestion: suggestion || '',
    tokensUsed: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
  }
}

/**
 * Appel à l'API OpenAI
 */
async function callOpenAI(
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<{ suggestion: string; tokensUsed: number }> {
  const openAIMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...formatMessagesForOpenAI(messages),
  ]

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: openAIMessages,
      max_tokens: 300,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ OpenAI API error:', errorText)
    throw new Error(`Erreur OpenAI: ${response.status}`)
  }

  const data = await response.json()
  const suggestion = data.choices?.[0]?.message?.content?.trim()

  return {
    suggestion: suggestion || '',
    tokensUsed: data.usage?.total_tokens ?? 0,
  }
}

Deno.serve(
  createHandler<SuggestionRequestBody>(async (_req, body) => {
    const useAnthropic = AI_PROVIDER === 'anthropic'

    if (useAnthropic && !ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY non configurée')
    }
    if (!useAnthropic && !OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configurée')
    }

    const { messages, clientEmail } = body

    if (!messages || messages.length === 0) {
      throw new Error('Historique des messages requis')
    }

    // Prendre les 10 derniers messages max pour le contexte
    const recentMessages = messages.slice(-10)

    console.log(
      `🤖 Génération suggestion via ${useAnthropic ? 'Claude' : 'OpenAI'} (${recentMessages.length} messages)`,
    )

    // Contexte additionnel si email client disponible
    const contextInfo = clientEmail ? `\n\nClient: ${clientEmail}` : ''
    const fullSystemPrompt = SYSTEM_PROMPT + contextInfo

    const result = useAnthropic
      ? await callAnthropic(fullSystemPrompt, recentMessages)
      : await callOpenAI(fullSystemPrompt, recentMessages)

    if (!result.suggestion) {
      throw new Error('Aucune suggestion générée')
    }

    console.log('✅ Suggestion générée avec succès')

    return {
      suggestion: result.suggestion,
      tokensUsed: result.tokensUsed,
    }
  }),
)
