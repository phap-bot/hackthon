import Image from "next/image";

const Clientsay = () => {
    return (
        <div className="mx-auto max-w-2xl py-40 px-4s sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="bg-image-what">
                <h3 className='text-dark text-center text-4xl lg:text-6xl font-semibold'>Khách hàng nói gì về chúng tôi.</h3>
                <h4 className="text-lg font-normal text-neutral text-center mt-4">Hơn 50,000 khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi. <br /> Hãy cùng lắng nghe những chia sẻ chân thực từ họ.</h4>

                <div className="lg:relative">
                    <Image src={'/assets/clientsay/traveler-avatars.png'} alt="traveler-avatars-image" width={1061} height={733} className="hidden lg:block" />

                    <span className="lg:absolute lg:bottom-40 lg:left-80">
                        <Image src={'/assets/clientsay/traveler-photo.png'} alt="traveler-photo-image" width={168} height={168} className="mx-auto pt-10 lg:pb-10" />
                        <div className="lg:inline-block bg-white rounded-2xl p-5 shadow-sm">
                            <p className="text-base font-normal text-center text-neutral">Dịch vụ du lịch AI của các bạn thật tuyệt vời! Tôi đã có một chuyến đi <br /> hoàn hảo đến Nhật Bản với lịch trình được tối ưu hóa theo sở thích <br /> và ngân sách của mình. Rất cảm ơn!</p>
                            <h3 className="text-2xl font-medium text-center py-2">Nguyễn Minh Anh</h3>
                            <h4 className="text-sm font-normal text-center">Du khách từ Hà Nội</h4>
                        </div>
                    </span>

                </div>

            </div>
        </div>
    )
}

export default Clientsay;
