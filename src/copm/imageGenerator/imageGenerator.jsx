import React, { useRef, useState, useEffect } from 'react';
import './imageGenerator.css';
import default_img from '../assests/default_image.svg';

const generate = async (search, apiKey) => {
    const form = new FormData();
    form.append('prompt', search);

    try {
        const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                //67225af72f0589bd3f7c60661a0f4ee3c39b95de0978a9aaf9f91335533ea3240ada1b9a47e01378edea1672d5804eba
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
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        const apiKeyInput = window.prompt("Enter your API key:");
        if (apiKeyInput) {
            setApiKey(apiKeyInput);
        }
    }, []);

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            return;
        }

        try {
            setLoading(true);
            const imageUrl = await generate(inputRef.current.value, apiKey);
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
                <div className="header">Arti-Fy <span>TEXT</span></div>
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
