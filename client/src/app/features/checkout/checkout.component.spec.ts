import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { CheckoutComponent } from "./checkout.component";
import { AuthService } from "../../core/services/auth.service";
import { NotificationService } from "../../core/services/notification.service";
import { CheckoutService } from "../../core/services/checkout.service";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { provideZonelessChangeDetection } from "@angular/core";

describe("CheckoutComponent", () => {
    let component: CheckoutComponent;
    let fixture: ComponentFixture<CheckoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CheckoutComponent],
            providers: [
                provideZonelessChangeDetection(),

                provideRouter([]),

                { provide: AuthService, useValue: { getCurrentUser: () => null } },
                { provide: NotificationService, useValue: { error: () => {} } },
                { provide: CheckoutService, useValue: { checkout: () => of({ data: {} }) } },
                {
                    provide: Store,
                    useValue: {
                        select: () => of(null),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
