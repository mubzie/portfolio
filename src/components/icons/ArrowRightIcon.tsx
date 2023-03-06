import React from 'react'
import { IconComponentProps } from './types'

function ArrowRightIcon({ width, height, strokeWidth = 1.5 }: IconComponentProps) {


    return (
        <svg
            widths={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
            />
        </svg>

    )
}

export default ArrowRightIcon