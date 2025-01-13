import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-page',
  // standalone: true,
  // imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  features = [
    { icon: 'school', title: 'Easy Lesson Planning', description: 'Generate comprehensive lesson plans effortlessly.' },
    { icon: 'assignment', title: 'Automated Test Creation', description: 'Create tests and quizzes in seconds.' },
    { icon: 'help_outline', title: '24/7 AI Assistance', description: 'Get instant help and support anytime, anywhere.' }
  ];

  testimonials = [
    { name: 'Michael P', position: '6th Grade Math Teacher', message: "I've found TeachGenie to be an invaluable tool in my classroom. Its ease of use and intuitive design make it simple to integrate into my lesson plans. Whether I need supplemental resources, tests, or an engaging activity TeachGenie delivers on almost any topic with just a few clicks. I highly recommend it to any educator looking to enhance their teaching resources effortlessly." },
    { name: 'Peter H', position: 'High School Teacher', message: "I am thrilled to have TeachGenie as a resource! It’s quick, customizable, efficient and I love the seamless transition to other educational sites, making it a huge time-saver for teachers." },
    { name: 'Robert M', position: 'High School Teacher', message: 'TeachGenie has revolutionized the way I create lesson plans and tests. It saves me hours every week!' },
    { name: 'Donald S', position: 'Middle School Teacher', message: 'The AI assistance is a game-changer. I can get help anytime I need it.' },
  ];

  products: any[];

    responsiveOptions: any[] | undefined;

    constructor(private route: ActivatedRoute, private authService: AuthService) {
      this.products = this.testimonials;
      if (!this.authService.getUserInfo()){
        this.authService.init();
      }
    }

    ngOnInit() {
        // this.productService.getProductsSmall().then((products) => {
        //     this.products = products;
        // });
        this.products = this.testimonials;

       this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];

        // Used to initialize auth service and pass in the right path
      this.route.url.subscribe(([url]) => {
        const { path, parameters } = url;
        console.log("About path: ", path); // e.g. /products
        console.log(parameters); // e.g. { id: 'x8klP0' }
        this.authService.returnUrl = path;
      });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
        return "contrast";
    }
}
