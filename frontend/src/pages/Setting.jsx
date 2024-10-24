import React, { useState } from 'react';

const Setting = () => {
  const [settings, setSettings] = useState({
    setting1: false,
    setting2: false,
    setting3: false,
    setting4: false,
    setting5: false,
    setting6: false,
  });

  const toggleSetting = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  return (
    <div className="setting-page-container-unique"> {/* 흰색 배경을 위한 박스 */}
      <div className="setting-section-unique">
        <h3 className="setting-section-title-unique">설정 종류1</h3>
        <div className="setting-item-unique">
          <p>설정1</p>
          <p>설정1에 대한 설명</p>
          <label className="toggle-switch-unique">
            <input 
              type="checkbox" 
              checked={settings.setting1} 
              onChange={() => toggleSetting('setting1')} 
            />
            <span className="slider-unique"></span>
          </label>
        </div>
        <hr className="divider-unique" />
        <div className="setting-item-unique">
          <p>설정2</p>
          <p>설정2에 대한 설명</p>
          <label className="toggle-switch-unique">
            <input 
              type="checkbox" 
              checked={settings.setting2} 
              onChange={() => toggleSetting('setting2')} 
            />
            <span className="slider-unique"></span>
          </label>
        </div>
        <hr className="divider-unique" />
        <div className="setting-item-unique">
          <p>설정3</p>
          <p>설정3에 대한 설명</p>
          <label className="toggle-switch-unique">
            <input 
              type="checkbox" 
              checked={settings.setting3} 
              onChange={() => toggleSetting('setting3')} 
            />
            <span className="slider-unique"></span>
          </label>
        </div>
      </div>

      <hr className="section-divider-unique" />

      <div className="setting-section-unique">
        <h3 className="setting-section-title-unique">설정 종류2</h3>
        <div className="setting-item-unique">
          <p>설정1</p>
          <p>설정1에 대한 설명</p>
          <label className="toggle-switch-unique">
            <input 
              type="checkbox" 
              checked={settings.setting4} 
              onChange={() => toggleSetting('setting4')} 
            />
            <span className="slider-unique"></span>
          </label>
        </div>
        <hr className="divider-unique" />
        <div className="setting-item-unique">
          <p>설정2</p>
          <p>설정2에 대한 설명</p>
          <label className="toggle-switch-unique">
            <input 
              type="checkbox" 
              checked={settings.setting5} 
              onChange={() => toggleSetting('setting5')} 
            />
            <span className="slider-unique"></span>
          </label>
        </div>
        <hr className="divider-unique" />
        <div className="setting-item-unique">
          <p>설정3</p>
          <p>설정3에 대한 설명</p>
          <label className="toggle-switch-unique">
            <input 
              type="checkbox" 
              checked={settings.setting6} 
              onChange={() => toggleSetting('setting6')} 
            />
            <span className="slider-unique"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Setting;
