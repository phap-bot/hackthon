import Image from 'next/image';

interface cardDataType {
    imgSrc: string;
    heading: string;
    percent: string;
    subheading: string;
}

const cardData: cardDataType[] = [
    {
        imgSrc: '/assets/buyers/our-travelers.svg',
        percent: '50k+',
        heading: "Khách hàng tin tưởng",
        subheading: "Hơn 50,000 khách hàng đã tin tưởng và sử dụng dịch vụ của chúng tôi.",
    },
    {
        imgSrc: '/assets/buyers/trips-completed.svg',
        percent: '100k+',
        heading: "Chuyến đi hoàn thành",
        subheading: "Hơn 100,000 chuyến du lịch đã được lên kế hoạch và thực hiện thành công.",
    },
    {
        imgSrc: '/assets/buyers/happy-travelers.svg',
        percent: '98%',
        heading: "Khách hàng hài lòng",
        subheading: "98% khách hàng hài lòng với dịch vụ và sẽ giới thiệu cho bạn bè.",
    },
    {
        imgSrc: '/assets/buyers/travel-experts.svg',
        percent: '200+',
        heading: "Chuyên gia du lịch",
        subheading: "Đội ngũ hơn 200 chuyên gia du lịch giàu kinh nghiệm trên toàn thế giới.",
    }

]

const Buyers = () => {
    return (
        <div className='mx-auto max-w-7xl py-16 px-6'>
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-5'>
                {cardData.map((items, i) => (
                    <div className='flex flex-col justify-center items-center' key={i}>
                        <div className='flex justify-center border border-border  p-2 w-10 rounded-lg'>
                            <Image src={items.imgSrc} alt={items.imgSrc} width={30} height={30} />
                        </div>
                        <h2 className='text-4xl lg:text-6xl text-black font-semibold text-center mt-5'>{items.percent}</h2>
                        <h3 className='text-2xl text-black font-semibold text-center lg:mt-6'>{items.heading}</h3>
                        <p className='text-lg font-normal text-black text-center text-opacity-50 mt-2'>{items.subheading}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Buyers;
