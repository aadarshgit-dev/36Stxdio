import React, { useEffect, useState, useRef} from 'react'
import Canvas from './Canvas'
import data from './data'
import './index.css'
import LocomotiveScroll from 'locomotive-scroll';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
const App = () => {
  const growingSpan = useRef(null)
  const overlayRef = useRef(null)
  const headingRef = useRef(null)
  const [showCanvas, setShowCanvas] = useState(false);
  const isRedTheme = useRef(false);

  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll();
  }, [])

  useGSAP(() => {
    const handleClick = (e) => {
      if (!isRedTheme.current) {
        // 1. FIRST CLICK: Expand red circle to fill the screen
        isRedTheme.current = true;
        setShowCanvas(true);

        gsap.killTweensOf(growingSpan.current);
        gsap.killTweensOf(overlayRef.current);
        gsap.killTweensOf("body");
        gsap.killTweensOf("canvas");

        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(growingSpan.current, {
          top: e.clientY,
          left: e.clientX,
          xPercent: -50,
          yPercent: -50,
          scale: 0,
          opacity: 1,
        });

        // Expand the red circle so it covers the viewport
        gsap.to(growingSpan.current, {
          scale: 250,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Hand over to the full-screen overlay for clean opacity transitions
            gsap.set(overlayRef.current, { opacity: 1 });
            gsap.set(growingSpan.current, { scale: 0 });
          },
        });

        // Smoothly ease text color from white to black
        gsap.to("body", {
          color: "#000",
          duration: 1.0,
          ease: "power2.inOut",
        });

        // Smoothly reveal canvas peppers
        gsap.fromTo("canvas", { opacity: 0 }, { opacity: 1, duration: 1.0, ease: "power2.inOut" });
      } else {
        // 2. SECOND CLICK: Red opacity decreases smoothly and reveals the black background
        isRedTheme.current = false;

        gsap.killTweensOf(growingSpan.current);
        gsap.killTweensOf(overlayRef.current);
        gsap.killTweensOf("body");
        gsap.killTweensOf("canvas");

        // Ensure overlay is at opacity 1 to start the fade from red
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(growingSpan.current, { scale: 0 });

        // Decrease the red overlay's opacity from 1 down to 0 with a smooth ease
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
        });

        // Smoothly ease text color from black back to white
        gsap.to("body", {
          color: "#fff",
          duration: 1.0,
          ease: "power2.inOut",
        });

        // Smoothly fade out canvas peppers
        gsap.to("canvas", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setShowCanvas(false);
          },
        });
      }
    };

    const heading = headingRef.current;
    if (heading) {
      heading.addEventListener("click", handleClick);
    }
    return () => {
      if (heading) {
        heading.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <>
      {/* Full-screen overlay to ensure 100% visible, GPU-accelerated opacity fade from red to black */}
      <div
        ref={overlayRef}
        className='fixed inset-0 w-full h-full bg-[red] pointer-events-none z-0 opacity-0'
      ></div>

      <span
        ref={growingSpan}
        className='growing fixed top-[-20px] left-[-20px] w-5 h-5 block rounded-full bg-[] pointer-events-none z-0'
      ></span>
      <div className='relative w-full min-h-screen font-helvetica_now_display '>
        {showCanvas && data[0].map((canvasdets, cIndex) => (
          <Canvas key={cIndex} details={canvasdets} />
        ))}
        <div className='w-full h-screen relative z-[1]'>
          <nav className='w-full px-10 py-6 flex justify-between items-center'>
            <div className='brand text-2xl font-regular tracking-tight'>
              Thirtysixstudio
            </div>
            <div className='links flex gap-8'>
              {["What we do", "Who we are", "How we give back", "Talk to us"].map((link, index) => (
                <a
                  key={index}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className='text-md hover:text-gray-400 transition-colors'
                >
                  {link}
                </a>
              ))}
            </div>
          </nav>
          <div className='textcontainer w-full px-[15%] '>
            <div className='text w-[50%]'>
              <h3 className='text-3xl leading-[1.5]'>
                At Thirtysixstudio, we build digital assets and immersive experiences for purposeful brands.
              </h3>
              <p className='text-lg w-[80%] mt-10 font-light'>
                We're a boutique production studio focused on design, animation, and technology, constantly rethinking what digital craft can do for present-day ads and campaigns.
              </p>
              <p className='text-md font-light  mt-10'>Scroll</p>
            </div>
          </div>
          <div className='w-full absolute bottom-0 left-0 '>
             
            <h1 
            ref={headingRef}
            className='text-[14rem] font-normal tracking-tight leading-none pl-10 '>
              Thirtysixstudios
              </h1>
          </div>
        </div>
      </div>
      <div className='w-full relative h-screen  mt-32 px-10'>
        {data[1].map((canvasdets, cIndex) => (
          <Canvas key={cIndex} details={canvasdets} />
        ))}
        <div className='relative z-[1]'>
 <h1 className='w-full font-normal tracking-tighter text-8xl py-10'>
          About 36studios
        </h1>
        <p className='w-full text-4xl font-light leading-[1.8]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis ipsum rem laudantium. Libero, dicta. Facere, voluptatum autem praesentium quae excepturi neque voluptatibus sint repellendus illum labore voluptates. Ipsa, voluptatibus aliquid.
        </p>
        <img className='w-[30%] h-[30vh] rounded-2xl object-cover mt-20'
         src="https://i.pinimg.com/736x/d4/fd/37/d4fd372de9461c4af4f87909622dfedc.jpg" 
         alt="" />
        </div>
       
      </div>
    </>
  )
}

export default App
  