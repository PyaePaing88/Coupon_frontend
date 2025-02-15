import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import {
  PurchaseAndUserDTO,
  PurchaseService,
} from '../Services/purchase.service';
import { CouponService } from '../Services/coupon.service';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService } from '../Websocket/websocket.service';
import { Purchase } from '../models/purchase';
import { environment } from '../../environments/environment';

interface CouponData {
  date: string; // Date in the format "YYYY-MM-DD"
  value: number; // Count of confirmed coupons
}

@Component({
  selector: 'app-adm-home',
  templateUrl: './adm-home.component.html',
  styleUrls: ['./adm-home.component.css'],
})
export class AdmHomeComponent {
  isSidebarCollapsed = false;
  title: any;

  purchases: PurchaseAndUserDTO[] = [];
  isLoading = true;
  errorMessage = '';

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.updateChartSize();
    this.updatePieChartSize();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  userId: number = 0;
  userName: string = '';
  userEmail: string = '';
  profileImage: string | null = null;
  userDetails: any = null;

  // Metrics
  totalLoginUsers: number = 0;
  totalBusinesses: number = 0;
  totalPackages: number = 0;
  totalCouponSales = 0;

  confirmedPurchaseCount: number = 0;

  baseUrl = environment.apiUrl;

  startDate: string = new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split('T')[0]; // Default: 7 days ago
  endDate: string = new Date().toISOString().split('T')[0]; // Default: today
  isDataAvailable: boolean = false;

  chartData: any[] = [];

  filteredPieChartData: { name: string; value: number }[] = [];
  filteredBarChartData: { name: string; value: number }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private couponService: CouponService,
    private purchaseService: PurchaseService,
    private toastr: ToastrService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedUser();
    if (user) {
      this.userId = user.id;
    } else {
      console.error('User is null');
    }
    this.fetchChartData();
    this.generateYAxisTicks();
    this.loadUserDetails();
    this.fetchUserCount();
    this.fetchBusinessCount();
    this.fetchPackagesCount();
    this.loadConfirmedPurchaseCount();
    this.fetchCouponCount();
    this.loadPieChartData(); // Fetch initial data
    this.subscribeToRealTimeUpdates(); // this.setChartView(window.innerWidth);
    this.onResize();
  }

  loadUserDetails(): void {
    if (this.userId > 0) {
      this.userService.getUserDetailsById(this.userId).subscribe({
        next: (data) => {
          this.userDetails = data;
          this.userName = data.name;
          this.userEmail = data.email;

          // Check if the photo is present and not null
          this.profileImage =
            data.photo || this.baseUrl + 'users_images/default.png'; // Fallback image
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
        },
      });
    } else {
      console.error('Invalid user ID. Cannot load user details.');
    }
  }

  handleWebSocketMessage(message: string): void {
    // Display toast notification for WebSocket messages
    if (message) {
      this.toastr.info(message, 'New Notification');
    }
  }

  fetchUserCount(): void {
    this.userService.countALlUser().subscribe(
      (data) => {
        this.totalLoginUsers = data;
      },
      (error) => {
        console.error('Error fetching user count:', error);
      }
    );
  }

  fetchBusinessCount(): void {
    this.userService.countALlBusiness().subscribe(
      (data) => {
        this.totalBusinesses = data;
      },
      (error) => {
        console.error('Error fetching business count:', error);
      }
    );
  }

  fetchCouponCount(): void {
    this.userService.countALlCoupons().subscribe(
      (data) => {
        this.totalCouponSales = data;
      },
      (error) => {
        console.error('Error fetching packages count:', error);
      }
    );
  }

  fetchPackagesCount(): void {
    this.userService.countALlPackages().subscribe(
      (data) => {
        this.totalPackages = data;
      },
      (error) => {
        console.error('Error fetching packages count:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }

  colorScheme: Color = {
    domain: [
      '#007BFF',
      '#5DADE2',
      '#85C1E9',
      '#3498DB',
      '#AED6F1',
      '#1F618D',
      '#2E86C1',
      '#2874A6',
      '#6FA3EF',
      '#73C6B6',
      '#5499C7',
      '#2980B9',
      '#5499C7',
      '#7FB3D5',
      '#5B9BD5',
      '#A9CCE3',
      '#2874A6',
      '#2471A3',
      '#1ABC9C',
      '#48C9B0',
      '#0E6655',
      '#148F77',
      '#7FB3D5',
      '#154360',
      '#2471A3',
      '#D6EAF8',
    ],
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
  };

  view: [number, number] = [window.innerWidth * 0.75, 350];
  gradient = false;
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  updateChartSize() {
    if (this.isSidebarCollapsed == true) {
      const width = window.innerWidth * 0.88;
      const height = 350;
      this.view = [width, height];
    } else {
      const width = window.innerWidth * 0.75;
      const height = 350;
      this.view = [width, height];
    }
  }

  pieChartData = [];

  view2: [number, number] = [window.innerWidth * 0.35, 350];
  gradient2 = true;
  showLegend2 = true;

  colorScheme2: Color = {
    domain: [
      '#007BFF',
      '#5DADE2',
      '#85C1E9',
      '#3498DB',
      '#AED6F1',
      '#1F618D',
      '#2E86C1',
      '#2874A6',
      '#6FA3EF',
      '#73C6B6',
      '#1A5276',
      '#5499C7',
      '#2980B9',
      '#5499C7',
      '#7FB3D5',
      '#5B9BD5',
      '#A9CCE3',
      '#2874A6',
      '#154360',
      '#2471A3',
      '#1ABC9C',
      '#2C3E50',
      '#48C9B0',
      '#0E6655',
      '#148F77',
      '#3498DB',
      '#7FB3D5',
      '#154360',
      '#2471A3',
      '#D6EAF8',
    ],
    name: 'vibrant-colors',
    selectable: true,
    group: ScaleType.Ordinal,
  };

  updatePieChartSize() {
    if (this.isSidebarCollapsed == true) {
      const width2 = window.innerWidth * 0.4;
      const height2 = 350;
      this.view2 = [width2, height2];
    } else {
      const width2 = window.innerWidth * 0.35;
      const height2 = 350;
      this.view2 = [width2, height2];
    }
  }

  onSelect(event: any): void {
    console.log('Bar Chart Event:', event);
  }

  onChartSelect(event: any): void {
    console.log('Pie Chart Event:', event);
  }

  onDateChange(): void {
    this.fetchChartData();
  }

  fetchChartData(): void {
    this.couponService
      .getConfirmedCouponsByPurchaseDate(this.startDate, this.endDate)
      .subscribe(
        (data) => {
          if (data.length === 0) {
            this.toastr.info(
              'No bar chart data available for the selected date range.',
              'No Data'
            );
          }
          this.chartData = data;
          this.updateBarChart();
        },
        (error) => {
          console.error('Error fetching chart data:', error);
          this.toastr.error('Failed to fetch chart data', 'Error');
        }
      );
  }

  customYAxisTickFormatting(value: any): string {
    // Ensure only major numbers display
    return value;
  }

  chartOptions = {
    yAxis: {
      tickInterval: 10, // Decrease this value to reduce the space between ticks
      tickPadding: 5, // Reduces padding between ticks and axis labels
    },
  };

  formatXAxis(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  }

  generateYAxisTicks(): number[] {
    const min = 0; // Define your chart's minimum value
    const max = 10; // Define your chart's maximum value
    const interval = 1; // Step size between major ticks

    // Generate ticks with two intermediate lines
    const ticks = [];
    for (let i = min; i <= max; i += interval) {
      ticks.push(i);
      ticks.push(i + interval / 3); // First intermediate
      ticks.push(i + (2 * interval) / 3); // Second intermediate
    }
    return ticks.filter((tick) => tick <= max); // Ensure no overflow beyond max
  }

  updateBarChart(): void {
    // Logic to update the bar chart with chartData
    console.log('Updated chart data:', this.chartData);
  }

  loadPieChartData(): void {
    this.purchaseService.getPaymentTypeDistribution().subscribe({
      next: (data) => {
        if (data && Object.keys(data).length > 0) {
          console.log('Processed Pie Chart Data:', this.filteredPieChartData);
          this.filteredPieChartData = Object.keys(data).map((key) => ({
            name: key,
            value: data[key],
          }));
        } else {
          this.filteredPieChartData = []; // No data case
        }
      },
      error: (err) => {
        console.error('Error fetching payment type distribution:', err);
        this.filteredPieChartData = []; // Clear the chart in case of an error
      },
    });
  }

  subscribeToRealTimeUpdates(): void {
    this.webSocketService.subscribe('payment-type-updates', (message: any) => {
      this.loadPieChartData(); // Reload data on update
      this.fetchChartData();
      this.toastr.info('Payment type data updated!', 'Real-Time Update');
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any): void {
    // Adjust view size based on window width
    const width = window.innerWidth;

    if (width < 768) {
      // For small screens (mobile/tablet), set smaller charts
      this.view = [230, 200];
      this.view2 = [300, 200];
    }
  }

  loadConfirmedPurchaseCount(): void {
    this.purchaseService.getConfirmedPurchaseCount().subscribe({
      next: (count: number) => {
        this.confirmedPurchaseCount = count;
        console.log(`Confirmed Purchase Count: ${count}`);
      },
      error: (err) => {
        console.error('Error fetching confirmed purchase count:', err);
      },
    });
  }

  isNotificationOpen = false;

  toggleNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
  }
}
