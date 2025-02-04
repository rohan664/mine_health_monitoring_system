import { Swiper,SwiperSlide } from "swiper/react";
import Image from "next/image";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation,Autoplay } from 'swiper/modules';
import { swiperSlides } from "../utils/constants"; 

export const SwiperSlides = () => {
    return (
        <>
            <Swiper 
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                clickable: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay,Pagination, Navigation]}
                className="w-full h-full"
            >
            {
                swiperSlides.map((value,index)=>(
                    <SwiperSlide className="w-full h-full flex items-center justify-center" key={index}>
                        <div className="w-full h-screen flex flex-col gap-8 p-8" >
                            <div className="w-full flex items-center justify-center">
                                <Image
                                    src={value.images}
                                    alt="health_monitor"
                                    height={500}
                                />
                            </div>
                            <div className="w-full flex absolute right-0 bottom-8 items-center flex-col">
                                <h1 className="font-bold text-2xl text-secondaryDark text-center">{value.title}</h1>
                                <p className="text-center">{value.description}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            }
            </Swiper>
        </>
    )
}