import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
  ReturnDTO,
} from "@medusajs/framework/types"
import { ChangeActionType, promiseAll } from "@medusajs/framework/utils"
import { createOrderChange } from "./shared/create-order-change"

export async function cancelReturn(
  this: any,
  data: OrderTypes.CancelOrderReturnDTO,
  sharedContext?: Context
) {
  const returnOrder = (await this.retrieveReturn(
    data.return_id,
    {
      select: [
        "id",
        "order_id",
        "items.item_id",
        "items.quantity",
        "items.received_quantity",
      ],
      relations: ["items", "shipping_methods"],
    },
    sharedContext
  )) as ReturnDTO

  const actions: CreateOrderChangeActionDTO[] = []

  returnOrder.items.forEach((item) => {
    actions.push({
      action: ChangeActionType.CANCEL_RETURN_ITEM,
      order_id: returnOrder.order_id,
      return_id: returnOrder.id,
      reference: "return",
      reference_id: returnOrder.id,
      details: {
        reference_id: item.item_id,
        quantity: item.quantity,
      },
    })
  })

  returnOrder.shipping_methods?.forEach((shipping) => {
    actions.push({
      action: ChangeActionType.SHIPPING_REMOVE,
      order_id: returnOrder.order_id,
      return_id: returnOrder.id,
      reference: "return",
      reference_id: shipping.id,
      amount: shipping.raw_amount ?? shipping.amount,
    })
  })

  const [change] = await createOrderChange(
    this,
    data,
    returnOrder,
    actions,
    sharedContext,
    'return'
  )

  await promiseAll([
    this.updateReturns(
      [
        {
          data: {
            canceled_at: new Date(),
          },
          selector: {
            id: returnOrder.id,
          },
        },
      ],
      sharedContext
    ),
    this.confirmOrderChange(change.id, sharedContext),
  ])

  return returnOrder
}