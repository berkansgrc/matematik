
"use client";

import Lottie from "lottie-react";

interface LottiePlayerProps {
    animationData: any;
    className?: string;
}

const LottiePlayer = ({ animationData, className }: LottiePlayerProps) => {
    return (
        <Lottie 
            animationData={animationData} 
            loop={true} 
            className={className}
        />
    );
};

export default LottiePlayer;
