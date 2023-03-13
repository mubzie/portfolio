import Image from 'next/image'
import React, { memo, MouseEvent, useEffect, useState } from 'react'
import styles from '@/styles/Footer.module.scss'
import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyDataProps } from '@/pages';

export interface SpotifyPlayState {
    isOnline: boolean,
    songArtwork: string,
    songName: string,
    artistName: string,
    uri: string,
    previewUrl: string | null
}

function Footer({ spotifyData }: { spotifyData: SpotifyDataProps }) {

    const [spotifyPlayState, setSpotifyPlayState] = useState<SpotifyPlayState | null>(null);
    const [hasUserInteractedWithDom, setHasUserInteractedWithDom] = useState(false);

    const toggleSpotifyTrackPreview = (e: MouseEvent, type: string) => {
        const audioEl = document.getElementById("spotifyAudioPreview") as HTMLAudioElement;
        if (type === "enter") {
            if (hasUserInteractedWithDom) {
                audioEl.play().catch(err => console.log(err))
            }

        } else {
            audioEl.pause()
        }

    }

    useEffect(() => {
        const eventCallback = () => {
            setHasUserInteractedWithDom(true);

            window.removeEventListener("click", eventCallback)
        };

        window.addEventListener("click", eventCallback)

        return () => window.removeEventListener("click", eventCallback)
    }, [])


    useEffect(() => {
        const spotifyApi = new SpotifyWebApi();
        let intervalId: NodeJS.Timer;

        const getSpotifyPlayState = async () => {

            const patchArtistName = (artists: string[]) => {
                if (artists.length === 1) {
                    return artists[0]
                } else {
                    return `${artists[0]} ft ${artists.slice(1).join(", ")}`
                }
            }

            try {
                const currentPlayingTrack = await spotifyApi.getMyCurrentPlayingTrack();
                const recentlyPlayedTracks = await spotifyApi.getMyRecentlyPlayedTracks();

                if (currentPlayingTrack?.body) {
                    const body = currentPlayingTrack.body as any

                    setSpotifyPlayState({
                        isOnline: true,
                        songArtwork: body.item!.album.images[0].url,
                        songName: body.item.name,
                        artistName: patchArtistName(body.item.artists.map((a: any) => a.name)),
                        uri: body.item.uri,
                        previewUrl: body.item.preview_url

                    })
                } else {
                    setSpotifyPlayState({
                        isOnline: false,
                        songArtwork: recentlyPlayedTracks.body.items[0].track.album.images[0].url,
                        songName: recentlyPlayedTracks.body.items[0].track.name,
                        artistName: patchArtistName(recentlyPlayedTracks.body.items[0].track.artists.map(a => a.name)),
                        uri: recentlyPlayedTracks.body.items[0].track.uri,
                        previewUrl: recentlyPlayedTracks.body.items[0].track.preview_url

                    })
                }

                // console.log(currentPlayingTrack)
                // console.log(recentlyPlayedTracks)
            } catch (err: any) {
                if (err?.statusCode === 401) {
                    console.log("Spotify Token Expired")
                    // spotifyApi.refreshAccessToken().then(data => {
                    //     spotifyData.accessToken = data.body.access_token
                    // }).catch(() => {
                    //     if (intervalId) clearInterval(intervalId)
                    // })
                }
            }

        }

        if (spotifyData?.accessToken && spotifyData?.refreshToken) {
            spotifyApi.setAccessToken(spotifyData.accessToken);
            spotifyApi.setRefreshToken(spotifyData.refreshToken);

            getSpotifyPlayState()

        } else {

        }

        intervalId = setInterval(getSpotifyPlayState, 7000);

        () => clearInterval(intervalId);
    }, [spotifyData])
    return (
        <div className={styles.wrapper}>
            <div className={`${styles.spotify} ${spotifyPlayState ? styles.spotifyActive : ""}`}>
                <a
                    target={"_blank"}
                    href={spotifyPlayState?.uri}
                    className='hoverLinks'
                    onMouseEnter={(e: MouseEvent) => { toggleSpotifyTrackPreview(e, "enter") }}
                    onMouseLeave={(e: MouseEvent) => toggleSpotifyTrackPreview(e, "leave")}
                >
                    <Image
                        src={spotifyPlayState?.songArtwork || "/imgs/spotify-logo.png"}
                        alt={`${spotifyPlayState?.songName} artwork`}
                        width={30}
                        height={30}
                        style={{ borderRadius: "10px" }}
                    />
                    <Image
                        src={"/imgs/spotify-logo.png"}
                        alt={`${spotifyPlayState?.songName} artwork`}
                        width={20}
                        height={20}
                        style={{
                            position: "absolute",
                            top: "-10px",
                            right: "-10px",
                            filter: `grayscale(${spotifyPlayState?.isOnline ? 0 : 100}%)`
                        }}
                    />
                    {
                        spotifyPlayState?.previewUrl &&
                        <audio id='spotifyAudioPreview' controls loop src={spotifyPlayState.previewUrl}></audio>

                    }

                </a>

                <p>
                    {
                        spotifyPlayState?.isOnline ? "I'm currently listening to" : "Last played song"
                    }

                </p>
                <div>
                    <p>
                        <span>
                            {`${spotifyPlayState?.artistName} - ${spotifyPlayState?.songName}`}
                        </span>
                        <span>
                            {`${spotifyPlayState?.artistName} - ${spotifyPlayState?.songName}`}
                        </span>
                        <span>
                            {`${spotifyPlayState?.artistName} - ${spotifyPlayState?.songName}`}
                        </span>
                        <span>
                            {`${spotifyPlayState?.artistName} - ${spotifyPlayState?.songName}`}
                        </span>

                    </p>
                </div>
            </div>




            <div className={styles.designCredit}>
                <span>Designed with <small>&#10084;&#65039;</small>  by </span>
                <a href="https://www.behance.net/mubzie">Mubarak Rabiu</a>
            </div>

        </div>
    )
}

export default memo(Footer)