import React from "react";
import { useGetAllFoodsQuery } from "../../service/ClientService";
import TitleCategory from "../../components/TitleCategory/TitleCategory";

const HomePage = () => {
    const { data, isLoading, error } = useGetAllFoodsQuery(undefined);

    // data expected shape: { success: true, data: [ { category: {...}, foods: [...] }, ... ] }
    const groups: any[] = data?.data ?? data ?? [];

    return (
        <div className="relative min-h-screen bg-gray-200 2xl:pr-10 2xl:pl-10">
            <div className="p-4">
                {error ? (
                    <div className="text-center text-red-500 py-8">Không tải được dữ liệu</div>
                ) : (
                    <div className="space-y-6">
                        {groups.map((g: any, idx: number) => (
                            <TitleCategory key={g.category?.id ?? g.id ?? Math.random()} index={idx + 1} title={g.category?.name ?? g.name ?? 'Danh mục'} foods={g.foods ?? []} />
                        ))}
                    </div>
                )}
            </div>

            {/* Full page light-gray overlay with centered spinner while loading */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/20 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <svg className="w-16 h-16 text-gray-700 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <div className="text-gray-700 font-medium">Đang tải...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;