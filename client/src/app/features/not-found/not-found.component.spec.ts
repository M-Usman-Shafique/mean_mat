import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { NotFoundComponent } from "./not-found.component";

describe("NotFound", () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotFoundComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({}),
                        snapshot: {
                            params: {},
                            queryParams: {},
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
