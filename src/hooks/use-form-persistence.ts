import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'

export function useFormPersistence<T extends object>(
  form: UseFormReturn<T>,
  storageKey: string,
  excludeFields?: (keyof T)[],
) {
  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Only set values that are part of the original object to avoid junk
        Object.keys(parsed).forEach((key) => {
          if (!excludeFields?.includes(key as keyof T)) {
            form.setValue(key as any, parsed[key], {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        })
      } catch (e) {
        console.error('Failed to parse form data from localStorage', e)
      }
    }
  }, [form, storageKey, excludeFields])

  // Save on changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const dataToSave = { ...value }
      excludeFields?.forEach((field) => {
        delete dataToSave[field as keyof typeof dataToSave]
      })
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    })
    return () => subscription.unsubscribe()
  }, [form, storageKey, excludeFields])

  const clearPersistence = () => {
    localStorage.removeItem(storageKey)
  }

  return { clearPersistence }
}
