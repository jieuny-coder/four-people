import React from 'react'

const Header = () => {
    return (
        <div className='headercontainer'>
            <svg style={{
                width: "393",
                height: "100px",
                viewBox: "0 0 393 100",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
            }} >
                <rect
                    x="0"
                    y="0"
                    width="393"
                    height="100"
                    fill="#FFDA38"
                    rx="0" ry="0"
                    style={{ clipPath: "inset(0px 0px 0px 0px round 100px 100px 0px 0px)" }}
                />
                <path d="M0 51C0 23.3858 22.3858 1 50 1H343C370.614 1 393 23.3858 393 51V97H0V51Z" fill="#FFDA38" />
                <path d="M35.7568 56L27.0234 65.75L35.7568 75.5" stroke="black" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export default Header