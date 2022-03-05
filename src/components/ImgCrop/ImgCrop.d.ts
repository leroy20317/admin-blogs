/**
 * @author: leroy
 * @date: 2022-03-05 17:07
 * @description：ImgCrop.d.ts
 */
import * as React from 'react';
import { CropperProps } from 'react-easy-crop';
import type { Area } from 'react-easy-crop/types';
import type { ModalProps } from 'antd/es/modal/Modal';

export type BeforeUploadValueType = void | boolean | string | Blob | File;

export type EasyCropProps = Pick<ImgCropProps, 'cropperProps'> &
  Required<
    Pick<ImgCropProps, 'aspect' | 'shape' | 'grid' | 'zoom' | 'rotate' | 'minZoom' | 'maxZoom'>
  > & {
    image?: string;
    rotateValRef: React.MutableRefObject<number | undefined>;
    setZoomValRef: React.MutableRefObject<React.Dispatch<React.SetStateAction<number>> | undefined>;
    setRotateValRef: React.MutableRefObject<
      React.Dispatch<React.SetStateAction<number>> | undefined
    >;
    cropPixelsRef: React.MutableRefObject<Area | undefined>;
  };

export interface ImgCropProps {
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
  onModalOk?: (file: BeforeUploadValueType) => void;
  onModalCancel?: () => void;
  modalProps?: Omit<
    ModalProps,
    'visible' | 'wrapClassName' | 'title' | 'onOk' | 'onCancel' | 'maskClosable' | 'destroyOnClose'
  >;

  beforeCrop?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
  onUploadFail?: (err: Error) => void;
  cropperProps?: Partial<CropperProps>;
}
declare const ImgCrop: React.FC<ImgCropProps>;

export default ImgCrop;
