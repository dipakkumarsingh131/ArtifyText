import React, { useRef, useState } from 'react';
import './imageGenerator.css';
import default_img from '../assests/default_image.svg';

const generate = async (search) => {
    const form = new FormData();
    form.append('prompt', search);
    
    try {
        const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
            method: 'POST',
            headers: {
                'x-api-key': "000000000000000000000000000000000000000000000000000000000000000000000000000000",
            },
            body: form,
        });

        const buffer = await response.arrayBuffer();
        return URL.createObjectURL(new Blob([buffer]), { type: 'image/png' });
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
}

const ImageGenerator = () => {
    const [url, setUrl] = useState("/");
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            return;
        }

        try {
            setLoading(true);
            const imageUrl = await generate(inputRef.current.value);
            if (imageUrl) {
                setUrl(imageUrl);
            }
        } catch (error) {
            console.error("Error fetching image:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="ai-image">
                <div className="header">AI IMAGE <span>Generation</span></div>
                <div className="img-loading">
                    <div className="image"><img src={url === "/" ? default_img : url} alt="" /></div>
                    <div className="loading">
                        <div className={loading ? "loading-bar-full" : "loading-bar"}>
                            <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="serch-box">
                <input type="text" ref={inputRef} className='serch-input' placeholder='Describe What you want to see' />
                <div className="generate" onClick={imageGenerator}>Generate</div>
            </div>
        </div>
    );
};

export default ImageGenerator;