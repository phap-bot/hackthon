import Image from "next/image";

interface whydata {
    heading: string;
    subheading: string;
}

const whydata: whydata[] = [
    {
        heading: "Chất lượng dịch vụ",
        subheading: "Đảm bảo chất lượng dịch vụ cao nhất với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ AI tiên tiến.",
    },
    {
        heading: "Giao tiếp thân thiện",
        subheading: "Hỗ trợ khách hàng 24/7 với thái độ chuyên nghiệp và nhiệt tình, luôn sẵn sàng giải đáp mọi thắc mắc.",
    },
    {
        heading: "Đáng tin cậy",
        subheading: "Cam kết thực hiện đúng những gì đã hứa, đảm bảo chuyến đi của bạn diễn ra suôn sẻ và an toàn.",
    }
]


const Why = () => {
    return (
        <div id="about">

            <div className='mx-auto max-w-7xl px-4 my-20 sm:py-20 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2'>

                    {/* COLUMN-1 */}
                    <div className="lg:-ml-64">
                        <Image src="/assets/why/travel-app-mockup.png" alt="Travel App Mockup" width={4000} height={900} />
                    </div>

                    {/* COLUMN-2 */}
                    <div>
                        <h3 className="text-4xl lg:text-5xl pt-4 font-semibold sm:leading-tight mt-5 text-center lg:text-start">Tại sao chọn chúng tôi?</h3>
                        <h4 className="text-lg pt-4 font-normal sm:leading-tight text-center text-neutral lg:text-start">Đừng lãng phí thời gian tìm kiếm thủ công. Hãy để AI làm điều đó cho bạn. Đơn giản hóa quy trình, giảm thiểu sai sót và tiết kiệm thời gian.</h4>

                        <div className="mt-10">
                            {whydata.map((items, i) => (
                                <div className="flex mt-4" key={i}>
                                    <div className="rounded-full h-10 w-12 flex items-center justify-center bg-circlebg">
                                        <Image src="/assets/why/check.svg" alt="check-image" width={24} height={24} />
                                    </div>
                                    <div className="ml-5">
                                        <h4 className="text-2xl font-semibold">{items.heading}</h4>
                                        <h5 className="text-lg text-beach font-normal mt-2">{items.subheading}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default Why;
