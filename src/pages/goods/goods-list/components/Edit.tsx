import React, { Component, useEffect, useRef } from 'react';
import E from 'wangeditor';
//import { inject, observer } from 'mobx-react'
//import { withRouter } from 'react-router-dom'
import { uploadImg } from '../service';
//@withRouter @inject('appStore') @observer
function Editor(Props: any) {
  const editorElemMenu = useRef(null);
  const editorElemBody = useRef(null);

  useEffect(() => {
    // const elemMenu = this.refs.editorElemMenu;
    // const elemBody = this.refs.editorElemBody;
    if (editorElemMenu && editorElemBody) {
      const editor = new E('#editorElemMenu', '#editorElemBody');
      // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
      editor.config.onchange = (html: any) => {
        Props.onchange(editor.txt.html());
      };
      editor.config.uploadImgServer = '1'; // 上传图片到服务器

      editor.config.customUploadImg = async (resultFiles: any, insertImgFn: any) => {
        const formData = new window.FormData();
        formData.append('upfile', resultFiles[0]);
        formData.append('nodeCut', false as any);
        return await uploadImg(formData).then((res) => {
          insertImgFn(res.data.url);
          return res;
        });
      };

      editor.config.zIndex = 20000;
      // editor.config.menus = [
      //     'head',  // 标题
      //     'bold',  // 粗体
      //     'fontSize',  // 字号
      //     'fontName',  // 字体
      //     'italic',  // 斜体
      //     'underline',  // 下划线
      //     'strikeThrough',  // 删除线
      //     'foreColor',  // 文字颜色
      //     'backColor',  // 背景颜色
      //     'link',  // 插入链接
      //     'list',  // 列表
      //     'justify',  // 对齐方式
      //     'quote',  // 引用
      //     'emoticon',  // 表情
      //     'image',  // 插入图片
      //     'table',  // 表格
      //     'video',  // 插入视频
      //     'code',  // 插入代码
      //     'undo',  // 撤销
      //     'redo', // 重复
      //     'full'
      // ]
      // editor.config.uploadImgShowBase64 = true
      editor.create();
      editor.txt.html(Props.defaultValue);
      return () => {
        editor.destroy();
      };
    } else {
      return () => {};
    }
  }, [editorElemMenu, editorElemBody]);

  return (
    <div className="shop" style={{ marginLeft: '30px' }}>
      <div className="text-area">
        <div
          ref={editorElemMenu}
          id="editorElemMenu"
          style={{ backgroundColor: '#f1f1f1', border: '1px solid #ccc' }}
          className="editorElem-menu"
        ></div>
        <div
          style={{
            padding: '0 10px',
            overflowY: 'scroll',
            height: 300,
            border: '1px solid #ccc',
            borderTop: 'none',
          }}
          ref={editorElemBody}
          id="editorElemBody"
          className="editorElem-body"
        ></div>
      </div>
    </div>
  );
}

export default Editor;
