import Image from 'next/image'
import React from 'react'
import styles from '@/styles/Footer.module.scss'

function Footer() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.spotify}>
                <span className='hoverLinks'>
                    <Image
                        src={"/imgs/wiz.jpeg"}
                        alt={"spotify song artwork"}
                        width={30}
                        height={30}
                        style={{ borderRadius: "10px" }}
                    />
                </span>

                <p>Now Playing</p>
                <p>
                    <span>Wizkid Balance</span>
                </p>
            </div>

            <div className={styles.designCredit}>
                <span>Design with &#10084;&#65039; by </span>
                <a href="">Mubarak Rabiu</a>
            </div>

        </div>
    )
}

export default Footer