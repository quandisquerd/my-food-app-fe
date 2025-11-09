import { ReactNode } from "react";
import Box from "../../components/Box/Box"


interface FoodItem {
    id: number;
    name: string;
    image: string;
    price: string;
    description: string;
}
const datafake: FoodItem[] = [
    {
        id: 1,
        name: "Mì cay bò",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "49000",
        description: "Mì cay bò kèm rau, nấm và chả cá cay nồng Hàn Quốc."
    },
    {
        id: 2,
        name: "Cơm gà xối mỡ",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "45000",
        description: "Cơm gà chiên giòn vàng rụm, ăn kèm nước mắm tỏi ớt."
    },
    {
        id: 3,
        name: "Phở bò tái chín",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "55000",
        description: "Phở nước dùng trong, thịt bò tái chín thơm ngon chuẩn vị Hà Nội."
    },
    {
        id: 4,
        name: "Bún chả Hà Nội",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "48000",
        description: "Thịt nướng thơm lừng, ăn kèm bún, rau sống và nước chấm đậm vị."
    },
    {
        id: 5,
        name: "Hủ tiếu nam vang",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "52000",
        description: "Nước lèo ngọt thanh từ xương hầm, tôm thịt đầy đủ."
    },
    {
        id: 6,
        name: "Bánh mì thịt nướng",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "25000",
        description: "Bánh mì giòn, thịt nướng thơm, kèm đồ chua và pate béo ngậy."
    },
    {
        id: 7,
        name: "Cơm chiên Dương Châu",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "40000",
        description: "Cơm chiên vàng đều, trứng, lạp xưởng, tôm khô hòa quyện đậm đà."
    },
    {
        id: 8,
        name: "Mì trộn trứng lòng đào",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "39000",
        description: "Mì trộn nước sốt đặc biệt, trứng lòng đào béo ngậy và tóp mỡ giòn."
    },
    {
        id: 9,
        name: "Gà rán giòn cay",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "60000",
        description: "Gà rán giòn tan phủ sốt cay Hàn Quốc, ăn kèm khoai tây chiên."
    },
    {
        id: 10,
        name: "Trà sữa trân châu đường đen",
        image: "https://micaykoreno.com/public/thumbs/500x500x1/80_1696581407_M%C3%AC%20b%C3%B2%20m%E1%BB%B9.webp",
        price: "35000",
        description: "Trà sữa béo thơm, trân châu dẻo và đường đen ngọt dịu."
    }
];

const HomePage = () => {
    return (
        <>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {datafake.map((data: FoodItem) => (
                    <Box key={data.id} data={data} />
                ))}
            </div>

        </>
    )
}

export default HomePage