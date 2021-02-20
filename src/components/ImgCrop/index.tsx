import React, { useState, useCallback, useRef, forwardRef } from 'react';
import Cropper, { CropperProps } from 'react-easy-crop';
import { Button, Modal, Slider } from 'antd';
import './index.less';

const pkg = 'antd-img-crop';
const noop = () => {};

const MEDIA_CLASS = `${pkg}-media`;

const ZOOM_STEP = 0.1;

const MIN_ROTATE = 0;
const MAX_ROTATE = 360;
const ROTATE_STEP = 1;

interface ImgCropProps {
  aspect?: number;
  shape?: 'rect' | 'round';
  grid?: boolean;
  quality?: number;
  fillColor?: string;

  zoom?: boolean;
  rotate?: boolean;
  minZoom?: number;
  maxZoom?: number;

  modalTitle?: string;
  modalWidth?: number | string;
  modalOk?: string;
  modalCancel?: string;

  isSkip?: boolean;
  modalSkip?: string;

  beforeCrop?: (file: File, fileList: File[]) => boolean;
  cropperProps?: Partial<CropperProps>;

  children?: any;
}

interface EasyCropProps {
  src: string;
  aspect: number;
  shape: 'rect' | 'round';
  grid: boolean;

  hasZoom: boolean;
  zoomVal: number;
  rotateVal: number;
  setZoomVal: (zoom: number) => void;
  setRotateVal: (rotation: number) => void;

  minZoom: number;
  maxZoom: number;
  onComplete: Function;

  cropperProps?: Partial<CropperProps>;
}
const EasyCrop = forwardRef<any, EasyCropProps>((props, ref) => {
  const {
    src,
    aspect,
    shape,
    grid,

    hasZoom,
    zoomVal,
    rotateVal,
    setZoomVal,
    setRotateVal,

    minZoom,
    maxZoom,
    onComplete,

    cropperProps,
  } = props;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      onComplete(croppedAreaPixels);
    },
    [onComplete],
  );

  const onMediaLoaded = useCallback(
    (mediaSize) => {
      const { width, height } = mediaSize;
      const ratioWidth = height * aspect;

      if (width > ratioWidth) {
        setCropSize({ width: ratioWidth, height });
      } else {
        setCropSize({ width, height: width / aspect });
      }
    },
    [aspect],
  );

  return (
    <Cropper
      {...cropperProps}
      ref={ref}
      image={src}
      crop={crop}
      cropSize={cropSize}
      onCropChange={setCrop}
      aspect={aspect}
      cropShape={shape}
      showGrid={grid}
      zoomWithScroll={hasZoom}
      zoom={zoomVal}
      rotation={rotateVal}
      onZoomChange={setZoomVal}
      onRotationChange={setRotateVal}
      minZoom={minZoom}
      maxZoom={maxZoom}
      onCropComplete={onCropComplete}
      onMediaLoaded={onMediaLoaded}
      classes={{ containerClassName: `${pkg}-container`, mediaClassName: MEDIA_CLASS }}
    />
  );
});

const ImgCrop = forwardRef<any, ImgCropProps>((props, ref) => {
  const {
    aspect = 1,
    shape = 'rect',
    grid = false,
    quality = 0.4,

    zoom = true,
    rotate = false,
    minZoom = 1,
    maxZoom = 3,
    fillColor = 'white',

    modalTitle = '编辑图片',
    modalWidth,
    modalOk = '确定',
    modalCancel = '取消',

    isSkip = false,
    modalSkip = '跳过裁剪',

    beforeCrop,
    children,

    cropperProps,
  } = props;
  const hasZoom = zoom === true;
  const hasRotate = rotate === true;

  const [src, setSrc] = useState<any>('');
  const [zoomVal, setZoomVal] = useState(1);
  const [rotateVal, setRotateVal] = useState(0);

  const beforeUploadRef = useRef<any>();
  const fileRef = useRef<any>();
  const resolveRef = useRef<any>(noop);
  const rejectRef = useRef<any>(noop);

  const cropPixelsRef = useRef<any>();

  /**
   * Upload
   */
  const renderUpload = useCallback(() => {
    const upload: any = Array.isArray(children) ? children[0] : children;
    const { beforeUpload, accept, ...restUploadProps } = upload?.props || {};
    beforeUploadRef.current = beforeUpload;

    return {
      ...upload,
      props: {
        ...restUploadProps,
        accept: accept || 'image/*',
        beforeUpload: (file: File, fileList: File[]) =>
          new Promise((resolve, reject) => {
            if (beforeCrop && !beforeCrop(file, fileList)) {
              reject();
              return;
            }

            fileRef.current = file;
            resolveRef.current = resolve;
            rejectRef.current = reject;

            const reader = new FileReader();
            reader.addEventListener('load', () => {
              setSrc(reader.result);
            });
            reader.readAsDataURL(file);
          }),
      },
    };
  }, [beforeCrop, children]);

  /**
   * EasyCrop
   */
  const onComplete = useCallback((croppedAreaPixels) => {
    cropPixelsRef.current = croppedAreaPixels;
  }, []);

  /**
   * Controls
   */
  const isMinZoom = zoomVal - ZOOM_STEP < minZoom;
  const isMaxZoom = zoomVal + ZOOM_STEP > maxZoom;
  const isMinRotate = rotateVal === MIN_ROTATE;
  const isMaxRotate = rotateVal === MAX_ROTATE;

  const subZoomVal = useCallback(() => {
    if (!isMinZoom) setZoomVal(zoomVal - ZOOM_STEP);
  }, [isMinZoom, zoomVal]);

  const addZoomVal = useCallback(() => {
    if (!isMaxZoom) setZoomVal(zoomVal + ZOOM_STEP);
  }, [isMaxZoom, zoomVal]);

  const subRotateVal = useCallback(() => {
    if (!isMinRotate) setRotateVal(rotateVal - ROTATE_STEP);
  }, [isMinRotate, rotateVal]);

  const addRotateVal = useCallback(() => {
    if (!isMaxRotate) setRotateVal(rotateVal + ROTATE_STEP);
  }, [isMaxRotate, rotateVal]);

  const onClose = useCallback(() => {
    setSrc('');
    setZoomVal(1);
    setRotateVal(0);
  }, []);

  const onSkip = useCallback(async () => {
    onClose();
    let currentFile = fileRef.current;

    if (typeof beforeUploadRef.current !== 'function') {
      resolveRef.current(currentFile);
    }

    const res = beforeUploadRef.current(currentFile, [currentFile]);

    if (typeof res !== 'boolean' && !res) {
      console.error('beforeUpload must return a boolean or Promise');
      return;
    }

    if (res === true) resolveRef.current(currentFile);
    if (res === false) rejectRef.current('not upload');
    if (res && typeof res.then === 'function') {
      try {
        const passedFile = await res;
        const objectType = Object.prototype.toString.call(passedFile);
        if (objectType === '[object File]' || objectType === '[object Blob]')
          currentFile = passedFile;
        resolveRef.current(currentFile);
      } catch (err) {
        rejectRef.current(err);
      }
    }
  }, [onClose]);

  const onOk = useCallback(async () => {
    onClose();

    const naturalImg: any = document.querySelector(`.${MEDIA_CLASS}`);
    const { naturalWidth, naturalHeight } = naturalImg;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // create a max canvas to cover the source image after rotated
    const maxLen = Math.sqrt(naturalWidth ** 2 + naturalHeight ** 2);
    canvas.width = maxLen;
    canvas.height = maxLen;

    // rotate the image
    if (hasRotate && rotateVal > 0 && rotateVal < 360) {
      const halfMax = maxLen / 2;
      ctx?.translate(halfMax, halfMax);
      ctx?.rotate((rotateVal * Math.PI) / 180);
      ctx?.translate(-halfMax, -halfMax);
    }

    if (ctx) ctx.fillStyle = fillColor;
    ctx?.fillRect(0, 0, canvas.width, canvas.height);

    // draw the source image in the center of the max canvas
    const left = (maxLen - naturalWidth) / 2;
    const top = (maxLen - naturalHeight) / 2;
    ctx?.drawImage(naturalImg, left, top);

    // shrink the max canvas to the crop area size, then align two center points
    const maxImgData = ctx?.getImageData(0, 0, maxLen, maxLen);
    const { width, height, x, y } = cropPixelsRef.current;
    canvas.width = width;
    canvas.height = height;
    if (maxImgData) ctx?.putImageData(maxImgData, Math.round(-left - x), Math.round(-top - y));

    // get the new image
    const { type, name, uid } = fileRef.current;
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        let newFile: any = new File([blob], name, { type });
        newFile.uid = uid;

        if (typeof beforeUploadRef.current !== 'function') {
          resolveRef.current(newFile);
        }

        const res = beforeUploadRef.current(newFile, [newFile]);

        if (typeof res !== 'boolean' && !res) {
          console.error('beforeUpload must return a boolean or Promise');
          return;
        }

        if (res === true) resolveRef.current(newFile);
        if (res === false) rejectRef.current('not upload');
        if (res && typeof res.then === 'function') {
          try {
            const passedFile = await res;
            const objectType = Object.prototype.toString.call(passedFile);
            if (objectType === '[object File]' || objectType === '[object Blob]')
              newFile = passedFile;
            resolveRef.current(newFile);
          } catch (err) {
            rejectRef.current(err);
          }
        }
      },
      type,
      quality,
    );
  }, [hasRotate, onClose, quality, rotateVal]);

  const footer = isSkip
    ? [
        <Button key="back" onClick={onClose}>
          {modalCancel}
        </Button>,
        <Button key="skip" type="dashed" danger onClick={onSkip}>
          {modalSkip}
        </Button>,
        <Button key="ok" type="primary" onClick={onOk}>
          {modalOk}
        </Button>,
      ]
    : [
        <Button key="back" onClick={onClose}>
          {modalCancel}
        </Button>,
        <Button key="ok" type="primary" onClick={onOk}>
          {modalOk}
        </Button>,
      ];

  return (
    <>
      {renderUpload()}
      {src && (
        <Modal
          visible={true}
          wrapClassName={`${pkg}-modal`}
          title={modalTitle}
          onOk={onOk}
          onCancel={onClose}
          footer={footer}
          maskClosable={false}
          destroyOnClose
          width={modalWidth}
        >
          <EasyCrop
            ref={ref}
            src={src}
            aspect={aspect}
            shape={shape}
            grid={grid}
            hasZoom={hasZoom}
            zoomVal={zoomVal}
            rotateVal={rotateVal}
            setZoomVal={setZoomVal}
            setRotateVal={setRotateVal}
            minZoom={minZoom}
            maxZoom={maxZoom}
            onComplete={onComplete}
            cropperProps={cropperProps}
          />
          {hasZoom && (
            <div className={`${pkg}-control zoom`}>
              <button onClick={subZoomVal} disabled={isMinZoom}>
                －
              </button>
              <Slider
                min={minZoom}
                max={maxZoom}
                step={ZOOM_STEP}
                value={zoomVal}
                onChange={setZoomVal}
              />
              <button onClick={addZoomVal} disabled={isMaxZoom}>
                ＋
              </button>
            </div>
          )}
          {hasRotate && (
            <div className={`${pkg}-control rotate`}>
              <button onClick={subRotateVal} disabled={isMinRotate}>
                ↺
              </button>
              <Slider
                min={MIN_ROTATE}
                max={MAX_ROTATE}
                step={ROTATE_STEP}
                value={rotateVal}
                onChange={setRotateVal}
              />
              <button onClick={addRotateVal} disabled={isMaxRotate}>
                ↻
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
});

export default ImgCrop;
