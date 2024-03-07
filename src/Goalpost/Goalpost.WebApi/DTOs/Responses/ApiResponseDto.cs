namespace Goalpost.WebApi.DTOs.Responses
{

    public class ApiResponseDto<T>
    {
        public T? Result { get; set; }
        public ApiResponseType Type { get; set; }
        public string[]? ErrorMessages { get; set; }

        public ApiResponseDto() { }

        private ApiResponseDto(ApiResponseType type)
        {
            this.Type = type;
        }

        public static ApiResponseDto<T> CreateSuccess(T? result)
        {
            return new ApiResponseDto<T>(ApiResponseType.Success)
            {
                Result = result,
            };
        }

        public static ApiResponseDto<T> CreateError(string error)
        {
            return ApiResponseDto<T>.CreateError(new string[] { error });
        }

        public static ApiResponseDto<T> CreateError(string[] errors)
        {
            return new ApiResponseDto<T>(ApiResponseType.Error)
            {
                ErrorMessages = errors
            };
        }

        public static ApiResponseDto<T> CreateUnhandledError(string error)
        {
            return ApiResponseDto<T>.CreateUnhandledError(new string[] { error });
        }

        public static ApiResponseDto<T> CreateUnhandledError(string[] errors)
        {
            return new ApiResponseDto<T>(ApiResponseType.UnhandledError)
            {
                ErrorMessages = errors
            };
        }
    }
}
