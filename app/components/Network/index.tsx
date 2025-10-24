import Image from "next/image";

interface datatype {
    imgSrc: string;
    country: string;
    paragraph: string;
}

const Aboutdata: datatype[] = [
    {
        imgSrc: "/assets/network/vietnam.png",
        country: "Việt Nam",
        paragraph: 'Khám phá vẻ đẹp thiên nhiên và văn hóa đa dạng từ Bắc vào Nam',

    },
    {
        imgSrc: "/assets/network/nhat.png",
        country: "Nhật Bản",
        paragraph: 'Trải nghiệm văn hóa truyền thống và công nghệ hiện đại',

    },
    {
        imgSrc: "/assets/network/thai.png",
        country: "Thái Lan",
        paragraph: 'Thưởng thức ẩm thực ngon và các bãi biển tuyệt đẹp',

    },
    {
        imgSrc: "/assets/network/sing.png",
        country: "Singapore",
        paragraph: 'Thành phố xanh sạch với nhiều điểm tham quan thú vị',

    },
]

const Network = () => {
    return (
        <div className="bg-babyblue" id="project">
            <div className="mx-auto max-w-2xl py-20 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h3 className="text-4xl sm:text-6xl font-semibold text-center my-10 lh-81">Mạng lưới du lịch & <br /> điểm đến toàn cầu.</h3>

                <Image src={'/assets/network/map.png'} alt={"travel-map-image"} width={1400} height={800} />

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-4 lg:gap-x-8'>
                    {Aboutdata.map((item, i) => (
                        <div key={i} className='bg-white rounded-2xl p-5 shadow-xl'>
                            <div className="flex justify-start items-center gap-2">
                                <Image src={item.imgSrc} alt={item.imgSrc} width={55} height={55} className="mb-2" />
                                <h4 className="text-xl font-medium text-midnightblue">{item.country}</h4>
                            </div>
                            <hr />
                            <h4 className='text-lg font-normal text-bluegrey my-2'>{item.paragraph}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Network;
