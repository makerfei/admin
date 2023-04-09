import React, { useMemo, useState } from 'react';
import { LoadingOutlined, PlusOutlined, message, Upload } from 'antd';

import { uploadImg } from '../service'




const App = (Props) => {
    const { title = '', cutSize = 1, showUploadList = false, Defurl = '', onChange = () => { } } = Props
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(Defurl);
    const UploadButton = () => {
        return <div>
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    }

    return (
        <>{title}
            <Upload
                name="upfile"
                listType="picture-card"
                showUploadList={showUploadList}
                action={async (file) => {
                    const formData = new window.FormData();
                    formData.append('upfile', file);
                    formData.append('cutSize', cutSize);
                    return await uploadImg(formData).then(res => {
                        setImageUrl(res.data.url);
                        onChange(res.data.url)
                        return res
                    })
                }}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '80px' }} /> : UploadButton}
            </Upload >
        </>
    );
};

export default App;