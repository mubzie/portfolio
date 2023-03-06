import Head from 'next/head'
import home from '@/styles/index.module.scss'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TwitterIcon from '@/components/icons/TwitterIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import GithubIcon from '@/components/icons/GithubIcon'
import { useEffect, useRef } from 'react'
import { HomePageAnimation } from '@/utils/gsapAnimations/homePage'


export default function Home() {
  const animation = useRef<HomePageAnimation | null>(null)
  useEffect(() => {
    animation.current = new HomePageAnimation(home);

    animation.current.init()

    return () => animation.current?.dispose()
  }, [])

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
  return (
    <>
      <Head>
        <title>Ye - Mi Portfolio</title>
        <meta name="description" content="Creative Frontend Developer Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={home.main}>
        <section className={home.about}>
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
        </section>

        <section className={home.works}>
          <h2>{`Fun Projects that i've Built`}</h2>
          <div className={home.worksProjects}>
            <ul>
              <li>
                <p>
                  <span>#0</span>
                  <span>
                    WhatsAppClone
                  </span>
                </p>

                <span>
                  <RotatedArrowIcon />
                </span>
              </li>
              <li>
                <p>
                  <span>#0</span>
                  <span>
                    WhatsAppClone
                  </span>
                </p>

                <span>
                  <RotatedArrowIcon />
                </span>
              </li>
              <li>
                <p>
                  <span>#0</span>
                  <span>
                    WhatsAppClone
                  </span>
                </p>

                <span>
                  <RotatedArrowIcon />
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className={home.contact}>
          <h2>
            You should drop by
          </h2>
          <p>
            Got a question, proposal or project or want to work together on something? Feel free to reach out, and s possible to get back to you.
          </p>
          <button>Say Hello!</button>

          <fieldset> <legend>connect with me on my social</legend></fieldset>

          <div className={home.contactSocialIcons}>
            <span>
              <TwitterIcon width={"15px"} height={"15px"} />
            </span>
            <span>
              <LinkedInIcon width={"15px"} height={"15px"} />
            </span>
            <span>
              <GithubIcon width={"15px"} height={"15px"} />
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
