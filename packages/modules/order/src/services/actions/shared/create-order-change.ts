import { Context } from '@medusajs/framework/types'

export async function createOrderChange(
  service,
  data,
  entityRef,
  actions,
  sharedContext: Context,
  type: 'return' | 'exchange' | 'claim'
) {
  const basePayload = {
    order_id: entityRef.order_id,
    reference: type,
    reference_id: entityRef.id,
    description: data.description,
    internal_note: data.internal_note, 
    created_by: data.created_by,
    metadata: data.metadata,
    actions,
  }

  // Add specific id based on type
  const idField = `${type}_id`
  const payload = {
    ...basePayload,
    [idField]: entityRef.id
  }

  return await service.createOrderChange_(
    payload,
    sharedContext
  )
}