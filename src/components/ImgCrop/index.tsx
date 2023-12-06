import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef, memo } from 'react';
import Cropper from 'react-easy-crop';
import { Slider as AntSlider, Modal as AntModal, Button } from 'antd';
import './index.less';
import type { ReactNode } from 'react';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import type { BeforeUploadValueType, EasyCropProps, ImgCropProps } from './ImgCrop';
import { Area } from 'react-easy-crop/types';

const cls = 'img-crop';

const INIT_ZOOM = 1;
const ZOOM_STEP = 0.1;
const INIT_ROTATE = 0;
const ROTATE_STEP = 1;
const MIN_ROTATE = -180;
const MAX_ROTATE = 180;

const EasyCrop = forwardRef<Cropper, EasyCropProps>((props, ref) => {
  const {
    image,
    aspect,
    shape,
    grid,

    zoom,
    rotate,
    minZoom,
    maxZoom,

    rotateValRef,
    setZoomValRef,
    setRotateValRef,
    cropPixelsRef,

    cropperProps,
  } = props;

  const [crop, onCropChange] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      cropPixelsRef.current = croppedAreaPixels;
    },
    [cropPixelsRef],
  );

  const onMediaLoaded = useCallback(
    (mediaSize: any) => {
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

  const [zoomVal, setZoomVal] = useState(INIT_ZOOM);
  const [rotateVal, setRotateVal] = useState(INIT_ROTATE);
  rotateValRef.current = rotateVal;

  useEffect(() => {
    setZoomValRef.current = setZoomVal;
    setRotateValRef.current = setRotateVal;
  }, [setRotateValRef, setZoomValRef]);

  return (
    <>
      <Cropper
        {...cropperProps}
        ref={ref}
        image={image}
        crop={crop}
        cropSize={cropSize}
        onCropChange={onCropChange}
        aspect={aspect}
        cropShape={shape}
        showGrid={grid}
        zoomWithScroll={zoom}
        zoom={zoomVal}
        rotation={rotateVal}
        onZoomChange={setZoomVal}
        onRotationChange={setRotateVal}
        minZoom={minZoom}
        maxZoom={maxZoom}
        onCropComplete={onCropComplete}
        onMediaLoaded={onMediaLoaded}
        classes={{ containerClassName: `${cls}-container`, mediaClassName: `${cls}-media` }}
      />
      {zoom && (
        <section className={`${cls}-control ${cls}-control-zoom`}>
          <Button
            onClick={() => setZoomVal(zoomVal - ZOOM_STEP)}
            disabled={zoomVal - ZOOM_STEP < minZoom}
          >
            －
          </Button>
          <AntSlider
            min={minZoom}
            max={maxZoom}
            step={ZOOM_STEP}
            value={zoomVal}
            onChange={setZoomVal}
          />
          <Button
            onClick={() => setZoomVal(zoomVal + ZOOM_STEP)}
            disabled={zoomVal + ZOOM_STEP > maxZoom}
          >
            ＋
          </Button>
        </section>
      )}
      {rotate && (
        <section className={`${cls}-control ${cls}-control-rotate`}>
          <Button
            onClick={() => setRotateVal(rotateVal - ROTATE_STEP)}
            disabled={rotateVal === MIN_ROTATE}
          >
            ↺
          </Button>
          <AntSlider
            min={MIN_ROTATE}
            max={MAX_ROTATE}
            step={ROTATE_STEP}
            value={rotateVal}
            onChange={setRotateVal}
          />
          <Button
            onClick={() => setRotateVal(rotateVal + ROTATE_STEP)}
            disabled={rotateVal === MAX_ROTATE}
          >
            ↻
          </Button>
        </section>
      )}
    </>
  );
});

const EasyCropMemo = memo(EasyCrop);

const ImgCrop = forwardRef<Cropper, ImgCropProps & { children?: ReactNode }>((props, ref) => {
  const {
    aspect = 1,
    shape = 'rect',
    grid = false,
    quality = 0.4,
    fillColor = 'white',

    zoom = true,
    rotate = false,
    minZoom = 1,
    maxZoom = 3,

    modalTitle,
    onModalOk,
    onModalCancel,
    modalProps,

    beforeCrop,
    onUploadFail,
    cropperProps,
    children,
  } = props;

  const cb = useRef<
    Pick<ImgCropProps, 'onModalOk' | 'onModalCancel' | 'beforeCrop' | 'onUploadFail'>
  >({});
  cb.current.onModalOk = onModalOk;
  cb.current.onModalCancel = onModalCancel;
  cb.current.beforeCrop = beforeCrop;
  cb.current.onUploadFail = onUploadFail;

  /**
   * Upload
   */
  const [image, setImage] = useState('');
  const fileRef = useRef<RcFile>();
  const resolveRef = useRef<(file: BeforeUploadValueType) => void>();
  const rejectRef = useRef<(err: Error) => void>();
  const beforeUploadRef = useRef<UploadProps['beforeUpload']>();

  const uploadComponent = useMemo(() => {
    const upload = Array.isArray(children) ? children[0] : children;
    const { beforeUpload, accept, ...restUploadProps } = upload.props;
    beforeUploadRef.current = beforeUpload;

    return {
      ...upload,
      props: {
        ...restUploadProps,
        accept: accept || 'image/*',
        beforeUpload: (file: RcFile, fileList: RcFile[]) => {
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (resolve, reject) => {
            if (cb.current.beforeCrop && !(await cb.current.beforeCrop(file, fileList))) {
              reject();
              return;
            }

            fileRef.current = file;
            resolveRef.current = (newFile) => {
              cb.current.onModalOk?.(newFile);
              resolve(newFile);
            };
            rejectRef.current = (uploadErr) => {
              cb.current.onUploadFail?.(uploadErr);
              reject(uploadErr);
            };

            const reader = new FileReader();
            reader.addEventListener(
              'load',
              () => typeof reader.result === 'string' && setImage(reader.result),
            );
            reader.readAsDataURL(file);
          });
        },
      },
    };
  }, [children]);

  /**
   * Crop
   */
  const rotateValRef = useRef<number>();
  const setZoomValRef = useRef<React.Dispatch<React.SetStateAction<number>>>();
  const setRotateValRef = useRef<React.Dispatch<React.SetStateAction<number>>>();
  const cropPixelsRef = useRef<Area>();

  const onClose = () => {
    setImage('');
    setZoomValRef.current?.(INIT_ZOOM);
    setRotateValRef.current?.(INIT_ROTATE);
  };

  const onCancel = useCallback(() => {
    cb.current.onModalCancel?.();
    onClose();
  }, []);

  const onSkip = useCallback(async () => {
    onClose();

    // get the new image
    const currentFile = fileRef.current;

    if (!currentFile) return;

    if (typeof beforeUploadRef.current !== 'function') {
      return resolveRef.current?.(currentFile);
    }

    const res = beforeUploadRef.current(currentFile, [currentFile]);

    if (typeof res !== 'boolean' && !res) {
      console.error('beforeUpload must return a boolean or Promise');
      return;
    }

    if (res === true) return resolveRef.current?.(currentFile);
    if (res === false) return rejectRef.current?.(new Error('not upload'));
    if (res && res instanceof Promise) {
      try {
        const passedFile = await res;
        const fileType: any = Object.prototype.toString.call(passedFile);
        if (fileType instanceof File || fileType instanceof Blob) {
          return resolveRef.current?.(passedFile);
        }
        resolveRef.current?.(currentFile);
      } catch (err: any) {
        rejectRef.current?.(err);
      }
    }
  }, []);

  const onOk = useCallback(async () => {
    onClose();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    const imgSource = document.querySelector(`.${cls}-media`) as CanvasImageSource & {
      naturalWidth: number;
      naturalHeight: number;
    };
    const {
      width: cropWidth = 0,
      height: cropHeight = 0,
      x: cropX = 0,
      y: cropY = 0,
    } = cropPixelsRef.current || {};

    if (rotate && rotateValRef.current !== INIT_ROTATE) {
      const { naturalWidth: imgWidth, naturalHeight: imgHeight } = imgSource;
      const angle = (rotateValRef.current || 0) * (Math.PI / 180);

      // get container for rotated image
      const sine = Math.abs(Math.sin(angle));
      const cosine = Math.abs(Math.cos(angle));
      const squareWidth = imgWidth * cosine + imgHeight * sine;
      const squareHeight = imgHeight * cosine + imgWidth * sine;

      canvas.width = squareWidth;
      canvas.height = squareHeight;
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, squareWidth, squareHeight);

      // rotate container
      const squareHalfWidth = squareWidth / 2;
      const squareHalfHeight = squareHeight / 2;
      ctx.translate(squareHalfWidth, squareHalfHeight);
      ctx.rotate(angle);
      ctx.translate(-squareHalfWidth, -squareHalfHeight);

      // draw rotated image
      const imgX = (squareWidth - imgWidth) / 2;
      const imgY = (squareHeight - imgHeight) / 2;
      ctx.drawImage(imgSource, 0, 0, imgWidth, imgHeight, imgX, imgY, imgWidth, imgHeight);

      // crop rotated image
      const imgData = ctx.getImageData(0, 0, squareWidth, squareHeight);
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.putImageData(imgData, -cropX, -cropY);
    } else {
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, cropWidth, cropHeight);

      ctx.drawImage(imgSource, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    }

    // get the new image
    const { type, name = '', uid } = fileRef.current || {};
    const onBlob = async (blob: Blob | null) => {
      if (!blob) return;
      const newFile = Object.assign(new File([blob], name, { type }), { uid }) as RcFile;

      if (typeof beforeUploadRef.current !== 'function') {
        return resolveRef.current?.(newFile);
      }

      const res = beforeUploadRef.current(newFile, [newFile]);

      if (typeof res !== 'boolean' && !res) {
        console.error('beforeUpload must return a boolean or Promise');
        return;
      }

      if (res === true) return resolveRef.current?.(newFile);
      if (res === false) return rejectRef.current?.(new Error('not upload'));
      if (res && res instanceof Promise) {
        try {
          const passedFile = await res;
          const fileType: any = Object.prototype.toString.call(passedFile);
          if (fileType instanceof File || fileType instanceof Blob) {
            return resolveRef.current?.(passedFile);
          }
          resolveRef.current?.(newFile);
        } catch (err: any) {
          rejectRef.current?.(err);
        }
      }
    };
    canvas.toBlob(onBlob, type, quality);
  }, [fillColor, quality, rotate]);

  const getComponent = (titleOfModal: string) => (
    <>
      {uploadComponent}
      {image && (
        <AntModal
          open={true}
          wrapClassName={`${cls}-modal`}
          title={titleOfModal}
          onOk={onOk}
          onCancel={onCancel}
          maskClosable={false}
          destroyOnClose
          okText="确定"
          cancelText="跳过"
          {...modalProps}
          cancelButtonProps={{
            ...modalProps?.cancelButtonProps,
            onClick: (event) => {
              event.stopPropagation();
              onSkip();
            },
          }}
        >
          <EasyCropMemo
            ref={ref}
            image={image}
            aspect={aspect}
            shape={shape}
            grid={grid}
            zoom={zoom}
            rotate={rotate}
            rotateValRef={rotateValRef}
            setZoomValRef={setZoomValRef}
            setRotateValRef={setRotateValRef}
            minZoom={minZoom}
            maxZoom={maxZoom}
            cropPixelsRef={cropPixelsRef}
            cropperProps={cropperProps}
          />
        </AntModal>
      )}
    </>
  );

  return getComponent(modalTitle || '编辑图片');
});

export default ImgCrop;
