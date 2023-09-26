import Head from "next/head";
import home from "@/styles/index.module.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TwitterIcon from "@/components/icons/TwitterIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { HomePageAnimation } from "@/utils/gsapAnimations/HomePage";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import projects from "@/projects";
import Image from "next/image";
import SpotifyWebApi from "spotify-web-api-node";
import { useAppTheme } from "@/components/AppThemeProvider";
import gsap from "gsap";
import useLocomotiveScroll from "@/components/useLocoMotiveScroll";

export interface SpotifyDataProps {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  isError: boolean;
  error: { statusCode: number; body: any } | null;
}

export default function Home({
  spotifyData,
}: {
  spotifyData: SpotifyDataProps;
}) {
  const [isDarkMode] = useAppTheme();
  const animation = useRef<HomePageAnimation | null>(null);
  // const locoScroll = useLocomotiveScroll()

  const RotatedArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={4.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
      />
    </svg>
  );

  useEffect(() => {
    // if (locoScroll) {
    animation.current = new HomePageAnimation(home);
    animation.current.init();
    // locoScroll.destroy()
    // }

    return () => {
      // if (locoScroll) {
      //   locoScroll.destroy()
      // }
      if (animation.current) {
        animation.current?.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (animation.current) {
      animation.current.webglExperience.handleAppThemeChange(isDarkMode);
    }
  }, [isDarkMode]);

  return (
    <div className={home.wrapper}>
      <Head>
        <title>Mubzie Portfolio</title>
        <meta
          name="description"
          content="Creative Frontend Developer Portfolio"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={home.container}>
        <aside className={home.aside}>
          <nav>
            <div
              onClick={() => animation.current?.handleAsideAboutClick()}
              className="aboutNav"
            >
              <span className={home.asideNavIcons}>
                <ArrowRightIcon width={44} height={44} strokeWidth={5.5} />
              </span>

              <h2>About</h2>
            </div>
            <div
              onClick={() => animation.current?.handleAsideWorkClick()}
              className="workNav"
            >
              <span className={home.asideNavIcons}>
                <ArrowRightIcon width={44} height={44} strokeWidth={5.5} />
              </span>
              <h2>Work</h2>
            </div>
            <div
              onClick={() => animation.current?.handleAsideContactClick()}
              className="contactNav"
            >
              <span className={home.asideNavIcons}>
                <ArrowRightIcon width={44} height={44} strokeWidth={5.5} />
              </span>
              <h2>Contact</h2>
            </div>
          </nav>
          <div className={home.asideSocials}>
            <a
              href="https://twitter.com/mubzie_"
              target={"_blank"}
              className="hoverLinks"
            >
              <TwitterIcon width={"15px"} height={"15px"} />
              <span>Twitter</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mubarakrabiu/"
              target={"_blank"}
              className="hoverLinks"
            >
              <LinkedInIcon width={"15px"} height={"15px"} />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/mubzie"
              target={"_blank"}
              className="hoverLinks"
            >
              <GithubIcon width={"15px"} height={"15px"} />
              <span>GitHub</span>
            </a>
          </div>
        </aside>
        <main className={home.main}>
          <section data-scroll-section id="about" className={home.about}>
            <h1 data-scroll data-scroll-speed="2">
              bringing ideas to life with frontend technology
            </h1>
            <fieldset role={"presentation"}>
              <legend>About Me</legend>
              <p>
                {`Hi there, i'm Mubarak Rabiu a frontend developer currently based in Lagos Nigeria with up to 2 year experience creating performant FrontEnd Web appplication for the broswer.`}
              </p>
              <p>
                {`
              i'm of the idea that everything can be optimized while writing scalable, clean and readable code. Peek into my resume and i'm sure you will find what you are looking for
              `}
              </p>
            </fieldset>

            <div className={home.cvSumary}>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>Mubarak Rabiu</h2>
                <p>Creative Frontend Developer</p>
              </div>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>
                  Language, Stacks and Frameworks
                </h2>
                <p>
                  Html, Css, JavaScript, TypeScript, ReactJs, NextJs, Redux,
                  Scss, Tailwind Css, ThreeJs,
                </p>
              </div>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>Soft Skills</h2>
                <p>Leadership, Team player, communicator</p>
              </div>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>Interpersonal Skills</h2>
                <p>Team work, Effective communication, attention to details.</p>
              </div>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>Experience</h2>
                <p>Polongo.Ltd - Frontend Engineer Intern</p>
                <p>{`Jan ‘22 - feb ‘23 `}</p>
                <ul>
                  <li>
                    I built and completed all assigned design task within the
                    stipulated period.
                  </li>
                  <li>
                    I contributed and collaborated with my team member for every
                    team project that lead to the team successful project MVP
                    launch
                  </li>
                </ul>
              </div>
            </div>
            <a href="/assets/Mubarak-CV.pdf" download={true}>
              Download Full Resume
            </a>
          </section>

          <section data-scroll-section id="works" className={home.works}>
            <h2
              data-scroll
              data-scroll-speed="1"
            >{`Still Have  Doubts ?, Check out Projects I've Built And Worked On`}</h2>
            <div className={home.worksProjects}>
              <ul>
                {projects.map((project, i) => (
                  <li key={`${project.id}-${i}`}>
                    <div
                      className={home.projectTag}
                      onClick={() =>
                        animation.current?.animateProjects(
                          `${project.id}-${i}`,
                          i
                        )
                      }
                    >
                      <p>
                        <span>{i + 1 > 9 ? `#${i + 1}` : `#0${i + 1}`}</span>
                        <span>{project.name}</span>
                      </p>

                      <span>
                        <RotatedArrowIcon />
                      </span>
                    </div>
                    <div
                      id={`${project.id}-${i}`}
                      className={`${home.projectContent} `}
                    >
                      <div
                        className={`${home.projectContentImg} hoverLinks`}
                        onMouseEnter={(e) =>
                          animation.current?.animateProjectImgOnHover(
                            e.currentTarget,
                            "enter",
                            i
                          )
                        }
                        onMouseLeave={(e) =>
                          animation.current?.animateProjectImgOnHover(
                            e.currentTarget,
                            "leave",
                            i
                          )
                        }
                      >
                        <span>
                          <Image
                            src={project.img}
                            alt={"project artwork"}
                            fill={true}
                            style={{
                              objectFit: "cover",
                            }}
                            sizes="(min-width: 768px) 80vw,90vw"
                          />
                        </span>
                        <span className={home.projectContentImgOverlay}>
                          <Image
                            src={project.img}
                            alt={"project artwork"}
                            fill={true}
                            style={{
                              objectFit: "cover",
                              filter: `url(#noise-${i})`,
                            }}
                            sizes="(min-width: 768px) 33vw,100vw"
                          />
                          <svg>
                            <filter
                              id={`noise-${i}`}
                              x="0%"
                              y="0%"
                              width="100%"
                              height="100%"
                            >
                              {/* <feTurbulence baseFrequency='0.05 0.07' result='NOISE' numOctaves={0.5} id='image-turbulence' /> */}
                              <feTurbulence
                                baseFrequency="0.05 0.07"
                                result="NOISE"
                                numOctaves={1}
                                id="image-turbulence"
                                className={`image-turbulence-${i}`}
                              />
                              <feDisplacementMap
                                in="SourceGraphic"
                                in2="NOISE"
                                scale={50}
                                id="image-displacement"
                                className={`image-displacement-${i}`}
                              />
                            </filter>
                          </svg>
                        </span>
                      </div>

                      <p>{project.writeUp}</p>

                      <p>
                        <span style={{ backgroundColor: project.colorTheme }}>
                          Built with:
                        </span>
                        <span>{project.stack}</span>
                      </p>
                      <div className={home.projectContentLinks}>
                        <a href={project.links.live}>
                          <span>Live</span>
                          <span>
                            <RotatedArrowIcon />
                          </span>
                        </a>
                        {project.links.code && (
                          <a href={project.links.code}>
                            <span>Code</span>
                            <span>
                              <RotatedArrowIcon />
                            </span>
                          </a>
                        )}

                        {project.links.design && (
                          <a href={project.links.design}>
                            <span>Design</span>
                            <span>
                              <RotatedArrowIcon />
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section data-scroll-section id="contact" className={home.contact}>
            <h2>You should drop by</h2>
            <p>
              Got a question, proposal or project or want us to work together on
              something? Feel free to reach out to me, and i will get back to
              you as soon as posible.
            </p>
            <button>Say Hello!</button>

            <fieldset>
              {" "}
              <legend>connect with me on my social</legend>
            </fieldset>

            <div className={home.contactSocialIcons}>
              <a
                href="https://twitter.com/mubzie_"
                target={"_blank"}
                className="hoverLinks"
              >
                <TwitterIcon width={"15px"} height={"15px"} />
              </a>
              <a
                href="https://www.linkedin.com/in/mubarakrabiu/"
                target={"_blank"}
                className="hoverLinks"
              >
                <LinkedInIcon width={"15px"} height={"15px"} />
              </a>
              <a
                href="https://github.com/mubzie"
                target={"_blank"}
                className="hoverLinks"
              >
                <GithubIcon width={"15px"} height={"15px"} />
              </a>
            </div>
          </section>

          {/* <WorkProjectOverlay /> */}
        </main>
      </div>
      <Footer spotifyData={spotifyData} />
    </div>
  );
}

export async function getStaticProps() {
  let spotifyApi = new SpotifyWebApi({
    clientId: process.env.Spotify_Client_Id,
    clientSecret: process.env.Spotify_Client_Secret,
  });

  const spotifyData: SpotifyDataProps = {
    accessToken: "",
    refreshToken: "",
    expiresIn: 0,
    isError: false,
    error: null,
  };

  spotifyApi.setAccessToken(process.env.Spotify_Access_Token as string);
  spotifyApi.setRefreshToken(process.env.Spotify_RefreshToken as string);

  try {
    const data = await spotifyApi.refreshAccessToken();

    spotifyData.accessToken = data.body.access_token || null;
    spotifyData.refreshToken = process.env.Spotify_RefreshToken || null;
    spotifyData.expiresIn = data.body.expires_in || null;
    spotifyData.isError = false;
  } catch (err: any) {
    spotifyData.isError = true;
    spotifyData.error = {
      statusCode: err?.statusCode || null,
      body: err.body || null,
    };
  }

  return {
    props: {
      spotifyData,
    },
    // if theres no error revalidate and re-build the page 10 min before the spotify accessToken expires
    revalidate: spotifyData.expiresIn ? spotifyData.expiresIn - 600 : 40,
  };
}
