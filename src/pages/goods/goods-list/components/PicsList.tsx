import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { uploadImg, picsAdd, picsDel } from '../service'

const App = (Props: any) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>(
        Props.defaultValue
    );
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file: UploadFile) => {
        debugger
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || '');
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {

        return setFileList(newFileList);
    }


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <div style={{ margin: '30px' }}>
            主图列表：
            <Upload
                listType="picture-card"
                fileList={fileList}
                action={async (file: any) => {
                    const formData = new window.FormData();
                    let type = 0;
                    try {
                        if (file.type && file.type.split('/')[0] == 'video') {
                            type = 1;
                        }
                    } catch (error) {

                    }
                    formData.append('upfile', file);
                    let res = await uploadImg(formData)
                    let resAdd = await picsAdd({ goodsId: Props.goodsId, url: res.data.url, type: type });

                    setFileList([
                        ...fileList, {
                            goodsId: Props.goodsId,
                            url: res.data.url,
                            name: res.data.url,
                            uid: resAdd.data,
                            saveType: type
                        } as any])
                    return {} as any


                }}
                onPreview={handlePreview}
                onRemove={async (data: any) => {
                    await picsDel({ id: data.uid });
                    let list = fileList.filter((item: any) => {
                        return item.uid != data.uid
                    })
                    setFileList(list)

                }}
            // onChange={handleChange}
            >
                {fileList.length >= 5 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div >
    );
};

export default App;