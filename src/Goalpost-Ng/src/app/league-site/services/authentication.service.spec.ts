import { TestBed } from '@angular/core/testing';
import { ErrorApiResponse, SuccessApiResponse } from '@league-site/models';
import { of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { DataService } from './data-service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['logIn']);
    
    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [AuthenticationService, { provide: DataService, useValue: dataServiceSpy }],
    });
    // Inject both the service-to-test and its (spy) dependency
    authenticationService = TestBed.inject(AuthenticationService);
    // dataServiceSpy = TestBed.inject(
    //   DataService
    // ) as jasmine.SpyObj<DataService>;

  });

  afterEach(() => {
    authenticationService.logOut();
  })

  it('Set Bearer Token', () => {
    dataServiceSpy.logIn.and.returnValue(of(new SuccessApiResponse('myBearerToken')));
    authenticationService.logIn("email", "password").subscribe({
        next: (response) => expect(response.result).toBe('myBearerToken')
    });
    expect(authenticationService.getBearerToken()).toBe('Bearer myBearerToken');
  });

  it('Login Fail', () => {
    dataServiceSpy.logIn.and.returnValue(of(new ErrorApiResponse<string>("No good! Try harder.")));
    authenticationService.logIn("email", "password").subscribe({
        next: (response) => expect(response.result).toBeUndefined()
    });
    expect(authenticationService.getBearerToken()).toBe('Bearer null');
  });
});
