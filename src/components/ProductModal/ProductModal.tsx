import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useGetFoodByIdQuery } from '../../service/ClientService'
import { formatCurrency } from '../../utils/formatCurrency'

interface ProductModalProps {
    foodId: string
    isOpen: boolean
    onClose: () => void
}

const ProductModal = ({ foodId, isOpen, onClose }: ProductModalProps) => {
    const { data, isLoading } = useGetFoodByIdQuery({ id: foodId }, { skip: !foodId })
    const payload = data?.data ?? data ?? {}

    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [quantity, setQuantity] = useState<number>(1)

    useEffect(() => {
        if (!isOpen) return
        // reset when opened
        setSelectedVariantId(null)
        setSelectedOptions([])
        setQuantity(1)
    }, [isOpen, foodId])

    useEffect(() => {
        // default select first available variant if exists
        const first = (payload?.variants && payload.variants[0]) ? payload.variants[0].id : null
        setSelectedVariantId(first)
    }, [payload])

    if (!isOpen) return null

    const variants: any[] = payload?.variants ?? []
    const options: any[] = payload?.options ?? []

    const computeItemPrice = () => {
        const base = Number(payload?.base_price ?? payload?.price ?? 0)
        const variant = variants.find(v => v.id === selectedVariantId)
        const variantPrice = variant ? Number(variant.price ?? 0) : 0
        const optionsPrice = options
            .filter(o => selectedOptions.includes(o.id))
            .reduce((s, o) => s + Number(o.extra_price ?? 0), 0)
        return base + variantPrice + optionsPrice
    }

    const handleToggleOption = (id: string) => {
        if (selectedOptions.includes(id)) setSelectedOptions(selectedOptions.filter(o => o !== id))
        else setSelectedOptions([...selectedOptions, id])
    }

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')

        // create item payload with metadata
        const variant = variants.find(v => v.id === selectedVariantId) ?? null
        const chosenOptions = options.filter(o => selectedOptions.includes(o.id))

        const item = {
            id: payload.id,
            name: payload.name,
            image: payload.image_url ?? payload.image,
            price: computeItemPrice(),
            base_price: payload.base_price ?? payload.price,
            origin_price: payload.origin_price ?? null,
            quantity,
            variant: variant ? { id: variant.id, name: variant.name, price: variant.price } : null,
            options: chosenOptions.map(o => ({ id: o.id, name: o.name, extra_price: o.extra_price })),
        }

        // if same product with same variant+options exists, increment quantity
        const existingIndex = cart.findIndex((c: any) => {
            if (c.id !== item.id) return false
            // compare variant id
            const sameVariant = (c.variant?.id ?? null) === (item.variant?.id ?? null)
            // compare options ids
            const cOpts = (c.options || []).map((x: any) => x.id).sort().join(',')
            const iOpts = (item.options || []).map((x: any) => x.id).sort().join(',')
            return sameVariant && cOpts === iOpts
        })

        if (existingIndex !== -1) {
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 0) + quantity
        } else {
            cart.push(item)
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('cartUpdated'))
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h3 className="text-lg font-semibold">{payload.name ?? 'Sản phẩm'}</h3>
                        <p className="text-xs text-gray-500">{payload.description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-600 hover:text-black"><X /></button>
                </div>

                <div className="p-4 grid grid-cols-3 gap-6">
                    <div className="col-span-1 flex items-center justify-center">
                        <img src={payload.image_url ?? payload.image} alt={payload.name} className="w-full h-40 object-cover rounded" />
                    </div>

                    <div className="col-span-2">
                        <div className="flex items-center gap-4">
                            {payload.origin_price ? (
                                <div className="flex items-baseline gap-3">
                                    <span className="text-sm text-gray-400 line-through">{formatCurrency(payload.origin_price)}</span>
                                    <span className="text-2xl text-red-600 font-bold">{formatCurrency(payload.base_price ?? payload.price)}</span>
                                </div>
                            ) : (
                                <div className="text-2xl text-red-600 font-bold">{formatCurrency(payload.base_price ?? payload.price)}</div>
                            )}
                        </div>

                        <div className="mt-4">
                            <div className="text-sm font-medium mb-2">Biến thể</div>
                            {variants.length === 0 && <div className="text-xs text-gray-500">Không có biến thể</div>}
                            <div className="flex flex-col gap-2">
                                {variants.map(v => (
                                    <label key={v.id} className="flex items-center gap-3 text-sm">
                                        <input type="radio" name="variant" checked={selectedVariantId === v.id} onChange={() => setSelectedVariantId(v.id)} />
                                        <div className="flex-1">
                                            <div className="font-medium">{v.name}</div>
                                            <div className="text-xs text-gray-500">{formatCurrency(v.price)}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-sm font-medium mb-2">Tùy chọn</div>
                            <div className="flex flex-wrap gap-2">
                                {options.length === 0 && <div className="text-xs text-gray-500">Không có tuỳ chọn</div>}
                                {options.map(o => (
                                    <label key={o.id} className={`flex items-center gap-2 px-3 py-1 rounded-full border ${selectedOptions.includes(o.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                                        <input type="checkbox" checked={selectedOptions.includes(o.id)} onChange={() => handleToggleOption(o.id)} />
                                        <span className="text-sm">{o.name}</span>
                                        <span className="text-xs text-red-500">+{formatCurrency(o.extra_price)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm font-medium">Số lượng</div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-2 bg-gray-100 rounded border border-gray-300"
                                >
                                    -
                                </button>

                                <div className="px-2">{quantity}</div>

                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-2 bg-gray-100 rounded border border-gray-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="text-lg mt-3">Tổng: <span className="text-red-600 font-bold">{formatCurrency(computeItemPrice() * quantity)}</span></div>
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleAddToCart} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
