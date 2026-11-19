import { useEffect, useRef, useState } from "react"
import canvasimages from "./canvasimages"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Canvas({ details }) {
    const { startIndex, numImages, duration, size, top, left, zIndex } = details;
    
    // thirtysixstudio only has 3 animated pepper sequences (pepperA: 0-149, pepperB: 150-299, pepperC: 300-449).
    // pepperD, pepperE, pepperF, and pepperG do not have animated frames on the server, causing them to stay static.
    // Modulo 450 maps indices back into the working range (0-449) so all canvases animate.
    const validStartIndex = startIndex % 450;
    const [state, setstate] = useState({ value: validStartIndex });
    const canvasRef = useRef(null)

    useGSAP(() => {
        gsap.to(state, {
            value: validStartIndex + numImages - 1,
            duration: duration,
            ease: "linear",
            repeat: -1,
            onUpdate: () => setstate({ value: Math.round(state.value) }),
        })
        gsap.from(canvasRef.current,{
            opacity:0,
            duration:1,
            scale:0.5,
            ease:"power2.inOut",
        })
    })

    useEffect(() => {
        const scale = window.devicePixelRatio;
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        const img = new Image()
        img.src = canvasimages[state.value]

        img.onload = () => {
            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;
            canvas.style.width = canvas.offsetWidth + "px";
            canvas.style.height = canvas.offsetHeight + "px";
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        }
    }, [state])

    return (
        <canvas
           data-scroll
           data-scroll-speed={(Math.random().toFixed(1))}
           data-scroll-container
            ref={canvasRef}
            className="absolute"
            style={{
                width: `${size * 1.4}px`,
                height: `${size * 1.4}px`,
                top: `${top}%`,
                left: `${left}%`,
                zIndex: zIndex,
            }}
            id="canvas"
        ></canvas>
    )
}

export default Canvas
