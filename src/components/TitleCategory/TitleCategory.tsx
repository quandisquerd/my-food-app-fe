import React from 'react'
import Box from '../Box/Box'

interface FoodFromApi {
    id: string | number
    name: string
    image_url?: string
    base_price?: number
    description?: string
    [key: string]: any
}

interface TitleCategoryProps {
    title: string
    foods: FoodFromApi[]
    index?: number
}

const TitleCategory: React.FC<TitleCategoryProps> = ({ title, foods, index }) => {
    return (
        <section className="mb-6">
            <div className="flex items-center gap-4 mb-3">
                {typeof index === 'number' && (
                    <div className="w-14 h-14 flex items-center justify-center text-2xl font-extrabold text-gray-400 bg-gray-100 rounded-md">
                        {index}
                    </div>
                )}
                <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {foods && foods.length > 0 ? (
                    foods.map((f) => {
                        // map api shape to Box expected shape
                        const boxData = {
                            id: f.id,
                            name: f.name,
                            image: f.image_url || f.image || undefined,
                            // API provides base_price (sale price) and origin_price (original price)
                            base_price: f.base_price ?? f.price ?? 0,
                            origin_price: f.origin_price ?? null,
                            // legacy `price` kept for compatibility
                            price: f.base_price ?? f.price ?? 0,
                            description: f.description ?? ''
                        }
                        return (
                            <Box key={String(f.id)} data={boxData} />
                        )
                    })
                ) : (
                    <div className="text-sm text-gray-500">Không có món nào trong danh mục này.</div>
                )}
            </div>
        </section>
    )
}

export default TitleCategory
