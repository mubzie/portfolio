import React, { useEffect, useState } from 'react'
import LocomotiveScroll from 'locomotive-scroll';
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { rejects } from 'assert';
gsap.registerPlugin(ScrollTrigger);


let locoModuleOuterScope: LocomotiveScroll | null = null;


function useLocomotiveScroll() {
    const [locoScrollState, setLocoScrollState] = useState<LocomotiveScroll | null>(null);

    useEffect(() => {


        const load = async () => {
            const LocomotiveScroll = (await import("locomotive-scroll")).default

            //    Prevent locomotive from being initialized twice cause React 18 calls useEffect twice
            if (!locoModuleOuterScope) {
                const scrollContainer = document.querySelector(".appTheme")
                const locoScroll = new LocomotiveScroll({
                    el: scrollContainer as HTMLElement,
                    smooth: true,
                    smartphone: { smooth: true },
                    tablet: { smooth: true, breakpoint: 1024 },
                    lerp: 0.05,
                    multiplier: 1
                });;


                // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
                locoScroll.on("scroll", () => {
                    ScrollTrigger.update();
                });



                // tell ScrollTrigger to use these proxy methods for the "scrollContainer" element since Locomotive Scroll is hijacking things
                ScrollTrigger.scrollerProxy(".appTheme", {
                    scrollTop(value) {
                        if (arguments.length) {
                            return locoScroll.scrollTo(value!, { duration: 0, disableLerp: true })

                        } else {
                            return (locoScroll as any).scroll.instance.scroll.y
                        }
                    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
                    getBoundingClientRect() {
                        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                    },
                    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
                    pinType: (document.querySelector(".appTheme") as HTMLElement).style.transform ? "transform" : "fixed"
                })


                ScrollTrigger.defaults({ scroller: ".appTheme" });
                ScrollTrigger.refresh();

                setLocoScrollState(locoScroll);
                locoModuleOuterScope = locoScroll;

                console.log("useLocomotiveScroll")
            }



        }

        load();






        return () => {
            if (locoScrollState) {
                locoScrollState.destroy()
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return locoScrollState
}

export default useLocomotiveScroll