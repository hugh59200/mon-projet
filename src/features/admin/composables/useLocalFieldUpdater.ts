import { supabase } from '@/supabase/supabaseClient'
import type { Database } from '@/supabase/types/supabase'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { ref, watch } from 'vue'

// ✅ On récupère les noms de tables réelles du schéma public
type TableName = Extract<keyof Database['public']['Tables'], string>

/**
 * 🔁 Composable générique pour mettre à jour un champ Supabase avec synchronisation locale
 */
export function useLocalFieldUpdater<T extends { id: string }>(
  items: any,
  field: keyof T & string,
  table: TableName,
  defaultValue: string | null = null,
) {
  const toast = useToastStore()
  const localValues = ref<Record<string, string>>({})

  // 🔄 Synchronise les valeurs locales quand filteredData change
  watch(
    items,
    (rows: T[]) => {
      const vals: Record<string, string> = {}
      for (const row of rows) vals[row.id] = (row as any)[field] ?? defaultValue ?? ''
      localValues.value = vals
    },
    { immediate: true },
  )

  // 🧠 Update Supabase + UI instantanée
  async function updateValue(row: Pick<T, 'id'> & Record<string, any>, newValue: string) {
    localValues.value[row.id] = newValue // instantané pour UX fluide
    row[field] = newValue // met à jour la donnée locale immédiatement

    const { error } = await supabase
      .from(table)
      .update({ [field]: newValue })
      .eq('id', row.id)

    if (error) toast.show(`Erreur de mise à jour du champ ${field}`, 'danger')
    else toast.show(`${capitalize(field)} mis à jour ✅`, 'success')
  }

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return { localValues, updateValue }
}
