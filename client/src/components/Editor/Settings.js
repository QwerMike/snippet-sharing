import React from "react";
import "brace/mode/jsx";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import {
  DropdownButton,
  MenuItem
} from "react-bootstrap";

import Preferences from './Preferences';

const languages = [
    "javascript",
    "java",
    "python",
    "xml",
    "ruby",
    "sass",
    "markdown",
    "mysql",
    "json",
    "html",
    "csharp",
    "typescript",
    "css",
    "plain_text"
];

const themes = [
    "monokai",
    "github",
    "tomorrow",
    "kuroir",
    "twilight",
    "xcode",
    "textmate",
    "solarized_dark",
    "solarized_light",
    "terminal"
];

languages.forEach(lang => {
    require(`brace/mode/${lang}`);
    require(`brace/snippets/${lang}`);
});

themes.forEach(theme => {
    require(`brace/theme/${theme}`);
});

const Settings = ({readOnly, settings, setSettings}) => {

    const handleChange = event => setSettings(event.target.name, event.target.value);

    return (
        <div className='Settings'>
            <div>
                <h2>Settings</h2>
            </div>
            <div className="field">
                <label>Language:</label>
                <div className="control">
                    <DropdownButton
                        id="lanuage"
                        name="mode"
                        title={settings.mode}
                        onSelect={e => setSettings('mode', e)}
                    >
                        {languages.map(lang => (
                            <MenuItem eventKey={lang} key={lang} value={lang}>
                                {lang}
                            </MenuItem>
                        ))}
                    </DropdownButton>
                </div>
            </div>

            <div className="field">
                <label>Theme:</label>
                <div className="control">
                    <DropdownButton
                        id="theme"
                        name="theme"
                        title={settings.theme}
                        onSelect={e => setSettings('theme', e)}
                    >
                        {themes.map(theme => (
                            <MenuItem eventKey={theme} key={theme} value={theme}>
                                {theme}
                            </MenuItem>
                        ))}
                    </DropdownButton>
                </div>
            </div>

            <div className="field">
                <label>Font Size:</label>
                <div className="control">
                    <DropdownButton
                        id="fontSize"
                        name="fontSize"
                        title={settings.fontSize}
                        onSelect={e => setSettings('fontSize', e)}
                    >
                        {[14, 16, 18, 20, 24, 28, 32, 40].map(font => (
                            <MenuItem eventKey={font} key={font} value={font}>
                                {font}
                            </MenuItem>
                        ))}
                    </DropdownButton>
                </div>
            </div>

            <div className="field">
                <div className="control">
                    <span>
                        <label className="switch switch-pill switch-primary">
                            <input
                                disabled={settings.readOnly}
                                type="checkbox"
                                className="switch-input"
                                checked={settings.enableLiveAutocompletion}
                                onChange={e =>
                                    setSettings(
                                        "enableLiveAutocompletion",
                                        e.target.checked
                                    )
                                }
                            />
                            <span className={"switch-slider"} />
                        </label>
                    </span>
                    <label className={"switch-label"}>
                        Enable Live Autocomplete
                </label>
                </div>
            </div>

            <div className="field">
                <div className="control">
                    <span>
                        <label className="switch switch-pill switch-primary">
                            <input
                                disabled={settings.readOnly}
                                type="checkbox"
                                className="switch-input"
                                checked={settings.enableSnippets}
                                onChange={e => setSettings("enableSnippets", e.target.checked)
                                }
                            />
                            <span className={"switch-slider"} />
                        </label>
                    </span>
                    <label className={"switch-label"}>Enable Snippets</label>
                </div>
            </div>
        </div>
    );
}

export default Settings;
