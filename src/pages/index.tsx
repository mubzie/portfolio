import Head from 'next/head'
import home from '@/styles/index.module.scss'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TwitterIcon from '@/components/icons/TwitterIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import GithubIcon from '@/components/icons/GithubIcon'
import { useEffect, useRef, useState } from 'react'
import { HomePageAnimation } from '@/utils/gsapAnimations/HomePage'
import MouseHoverEffect from '@/utils/gsapAnimations/MouseHoverEffect'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'
import Link from 'next/link'
import projects from "@/projects"
import Image from 'next/image'
import SpotifyWebApi from "spotify-web-api-node";

export interface SpotifyDataProps {
  accessToken: string | null,
  expiresIn: number | null,
  isError: boolean;
  error: { statusCode: number, body: any } | null
}



export default function Home({ spotifyData }: { spotifyData: SpotifyDataProps }) {


  const animation = useRef<HomePageAnimation | null>(null);

  const RotatedArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={4.5}
      stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  )

  useEffect(() => {
    animation.current = new HomePageAnimation(home);
    const mouseHoverEffect = new MouseHoverEffect()

    animation.current.init();
    mouseHoverEffect.init();

    return () => {
      animation.current?.dispose();
      mouseHoverEffect.dispose()
    }
  }, [])




  return (
    <div className={home.wrapper}>
      <Head>
        <title>Ye - Mi Portfolio</title>
        <meta name="description" content="Creative Frontend Developer Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={home.container}>
        <aside className={home.aside}>
          <nav>
            <Link className='aboutNav' href={""} >
              <span className={home.asideNavIcons}>
                <ArrowRightIcon width={44} height={44} strokeWidth={5.5} />
              </span>

              <h2>About</h2>

            </Link>
            <Link className='workNav' href={""} >
              <span className={home.asideNavIcons}>
                <ArrowRightIcon width={44} height={44} strokeWidth={5.5} />
              </span>
              <h2>Work</h2>

            </Link>
            <Link className='contactNav' href={""}>
              <span className={home.asideNavIcons}>
                <ArrowRightIcon width={44} height={44} strokeWidth={5.5} />
              </span>
              <h2>Contact</h2>
            </Link>
          </nav>
          <div className={home.asideSocials}>
            <a href='#' className='hoverLinks'>
              <TwitterIcon width={"15px"} height={"15px"} />
              <span>Twitter</span>
            </a>
            <a href='#' className='hoverLinks'>
              <LinkedInIcon width={"15px"} height={"15px"} />
              <span>LinkedIn</span>
            </a>
            <a href='#' className='hoverLinks'>
              <GithubIcon width={"15px"} height={"15px"} />
              <span>GitHub</span>
            </a>



          </div>

        </aside>
        <main className={home.main}>
          <section id='about' className={home.about}>
            <h1>
              bringing ideas to life
              with frontend technology
            </h1>
            <fieldset role={"presentation"}>
              <legend>About Me</legend>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, pariatur exercitationem. Blanditiis totam ut unde magni, distinctio voluptatem excepturi illo deserunt velit. Dignissimos, temporibus vero consequuntur expedita quo nam iste!
                Asperiores dignissimos, obcaecati at non excepturi molestiae odio rem fuga placeat natus hic atque commodi. Explicabo enim atque non illo, debitis vero eveniet nam recusandae magni aut nisi commodi quas?
                Culpa facere in iure dolor rerum non ipsa est, natus ipsum quaerat quos facilis consequatur reiciendis quibusdam officia nostrum debitis, temporibus quas quod alias quasi laborum quae excepturi nulla? Quos.
                Dolorem sequi ea eligendi dolor expedita quae et maxime voluptas at sit quam blanditiis, eveniet quo facere fuga odit nam quia adipisci officia temporibus soluta eum voluptatem sapiente. Repellat, sapiente!.
              </p>
            </fieldset>

            <div className={home.cvSumary}>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>Adeyanju Adeyemi</h2>
                <p>Creative Frontend Developer</p>
              </div>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>Language</h2>
                <p>
                  JavaScript, Reactjs, CSS, TypeScript Gatsby, Python
                </p>
              </div>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>Skills</h2>
                <p>Team work, Effective communication, attention to details.</p>
              </div>
              <div className={home.cvSummaryContent}>
                <h2 className={home.cvSumary_header}>Experience</h2>
                <p>Google - Frontend Engineer</p>
                <p>{`Jan ‘22 - present`}</p>
                <ul>
                  <li>I completed and passed all personal design task within the stipulated period, through to stage 9.</li>
                  <li>I contributed and collaborated with my team member for every team project that lead to the team successful project launch</li>
                </ul>
              </div>
            </div>
            <button>Download Full Cv</button>
          </section>

          <section id='works' className={home.works}>
            <h2>{`Projects I've Built And Worked On`}</h2>
            <div className={home.worksProjects}>
              <ul>
                {
                  projects.map((project, i) => (
                    <li key={`${project.id}-${i}`}>
                      <div className={home.projectTag} onClick={() => animation.current?.animateProjects(`${project.id}-${i}`)}>
                        <p>
                          <span>{i + 1 > 9 ? `#${i + 1}` : `#0${i + 1}`}</span>
                          <span>
                            {project.name}
                          </span>
                        </p>

                        <span>
                          <RotatedArrowIcon />
                        </span>
                      </div>
                      <div id={`${project.id}-${i}`} className={`${home.projectContent} `}>
                        <div className={`${home.projectContentImg} hoverLinks`}>
                          <span>
                            <Image
                              src={"/imgs/wiz.jpeg"}
                              alt={"project artwork"}
                              fill={true}
                              style={{
                                objectFit: "cover",

                              }}
                            />
                          </span>
                          <span>
                            <Image
                              src={"/imgs/wiz.jpeg"}
                              alt={"project artwork"}
                              fill={true}
                              style={{
                                objectFit: "cover",

                              }}
                            />
                          </span>
                        </div>

                        <p>{project.writeUp}</p>

                        <p>Built with: {project.stack}</p>
                        <div className={home.projectContentLinks}>
                          <a href={project.links.live}>
                            <span>
                              Live
                            </span>
                            <span>
                              <RotatedArrowIcon />
                            </span>
                          </a>
                          <a href={project.links.code}>
                            <span>
                              Code
                            </span>
                            <span>
                              <RotatedArrowIcon />
                            </span>

                          </a>
                        </div>

                      </div>

                    </li>
                  ))
                }
              </ul>
            </div>
          </section>

          <section id='contact' className={home.contact}>
            <h2>
              You should drop by
            </h2>
            <p>
              Got a question, proposal or project or want to work together on something? Feel free to reach out, and s possible to get back to you.
            </p>
            <button>Say Hello!</button>

            <fieldset> <legend>connect with me on my social</legend></fieldset>

            <div className={home.contactSocialIcons}>
              <span className='hoverLinks'>
                <TwitterIcon width={"15px"} height={"15px"} />
              </span>
              <span className='hoverLinks'>
                <LinkedInIcon width={"15px"} height={"15px"} />
              </span>
              <span className='hoverLinks'>
                <GithubIcon width={"15px"} height={"15px"} />
              </span>
            </div>
          </section>

          {/* <WorkProjectOverlay /> */}
        </main>
      </div>
      <Footer spotifyData={spotifyData} />

    </div>
  )
}

export async function getStaticProps() {

  let spotifyApi = new SpotifyWebApi({
    clientId: process.env.Spotify_Client_Id,
    clientSecret: process.env.Spotify_Client_Secret
  });

  const spotifyData: SpotifyDataProps = {
    accessToken: "",
    expiresIn: 0,
    isError: false,
    error: null
  }

  spotifyApi.setAccessToken(process.env.Spotify_Access_Token as string);
  spotifyApi.setRefreshToken(process.env.Spotify_RefreshToken as string);



  try {
    const data = await spotifyApi.refreshAccessToken();

    spotifyData.accessToken = data.body.access_token || null;
    spotifyData.expiresIn = data.body.expires_in || null
    spotifyData.isError = false;

  } catch (err: any) {

    spotifyData.isError = true;
    spotifyData.error = { statusCode: err?.statusCode || null, body: err.body || null }
  }


  return {
    props: {
      spotifyData
    },
    // if theres no error revalidate and re-build the page 10 min before the spotify accessToken expires
    revalidate: spotifyData.expiresIn ? spotifyData.expiresIn - 600 : 40
  }
}
