import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Coupon } from '../models/Coupon';
import { ToastrService } from 'ngx-toastr';
import { CouponService } from '../Services/coupon.service';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;

  scannedResult: string | null = null;
  errorMessage: string | null = null;
  information: string[] = [];
  qrCodeReader: BrowserQRCodeReader | null = null;
  isScanning: boolean = true;
  coupon: Coupon | null = null;
  isModalOpen: boolean = false;
  isScanningActive: boolean = false; // Add this flag

  baseUrl = environment.apiUrl;

  constructor(
    private couponService: CouponService,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.startVideoStream();
  }

  ngOnDestroy(): void {
    this.stopVideoStream();
  }

  startVideoStream(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.errorMessage = 'Camera is not supported in your browser.';
      return;
    }

    this.qrCodeReader = new BrowserQRCodeReader();

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        console.log('Camera stream started successfully');
        setTimeout(() => {
          const video = this.videoElement?.nativeElement;
          if (video) {
            video.srcObject = stream;
            this.startScanning();
          } else {
            this.errorMessage = 'Video element not found in DOM.';
          }
        }, 100); // Wait for the DOM to render the video element
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
        this.handleCameraError(err);
      });
  }

  startScanning(): void {
    const video = this.videoElement?.nativeElement;
    if (this.qrCodeReader && video) {
      this.isScanningActive = true; // Enable scanning
      this.qrCodeReader.decodeFromVideoDevice(
        undefined,
        video,
        (result, error) => {
          if (result && this.isScanningActive) {
            this.handleScan(result.getText());
          } else if (error) {
            console.error('Scanning error:', error);
          }
        }
      );
    }
  }

  handleScan(result: string): void {
    if (!result) return; // Ignore empty or invalid scans

    // Stop further processing after the first valid scan
    if (this.scannedResult) return;

    // Store the scanned result
    this.scannedResult = result;

    // Clear any previous error messages
    this.errorMessage = null;

    // Stop the video stream and scanning process
    this.stopVideoStream();

    // Log the scanned result and initiate coupon search
    console.log('Scanned result:', this.scannedResult);
    this.searchCoupon();
  }

  stopVideoStream(): void {
    const video = this.videoElement?.nativeElement;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null; // Clear the video source
    }
    this.isScanning = false;
  }

  handleCameraError(err: any): void {
    if (err.name === 'NotAllowedError') {
      this.errorMessage =
        'Camera access was blocked. Please enable permissions in your browser settings.';
    } else if (err.name === 'NotFoundError') {
      this.errorMessage = 'No camera device found.';
    } else {
      this.errorMessage = 'Unable to access the camera. Please try again.';
    }
  }

  openModel(): void {
    this.isModalOpen = true;
    console.log('sdgaadsgdafsgdfsagdsagds');
    this.stopVideoStream();
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  searchCoupon(): void {
    this.route.paramMap.subscribe((params) => {
      const businessId = params.get('businessId');
      if (businessId) {
        const body = {
          businessId: businessId,
          couponCode: this.scannedResult!,
        };
        this.couponService.searchCoupon(body).subscribe({
          next: (coupon) => {
            this.coupon = coupon;
            this.closeModal();
          },
          error: (err) => {
            this.toast.error(err.message,"Scan Result");
            this.coupon=null;
            this.errorMessage = err.message;
            console.error(err); // Log detailed error for debugging
          },
          complete: () => console.log('Coupon search completed'),
        });
      } else {
        // Set error message if businessId is not found
        this.errorMessage = 'Your business is not identified.';
      }
    });
  }
}
