using Marketplace.Application.DTOs;

namespace Marketplace.Application.Interfaces;

public interface IStoreSettingService
{
    Task<StoreSettingDto> GetSettingsAsync();
    Task<StoreSettingDto> UpdateSettingsAsync(StoreSettingDto settings);
}