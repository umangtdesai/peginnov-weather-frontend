import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WeatherInfo } from '../models';
import {
  formatDateTime,
  kelvinToFahrenheit,
  downloadWeatherInfo,
} from '../utils';

/*
 * fires: @findWeatherClicked
 */

// IDEA: Table pagination; (future problem, for MVP, filter + download to excel).
@customElement('peginnov-table')
export class Table extends LitElement {
  @property({ type: Array }) weatherInfo!: WeatherInfo[];

  // IDEA: allow users to select rows and download them vs. full table
  // @property({ type: Array }) selectedRows: WeatherInfo[] = [];

  static styles = css`
    .container {
      margin: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    cds-table {
      width: 100%;
    }

    cds-table-header-cell {
      font-weight: bold;
    }

    cds-table-row {
      cursor: pointer;
      background-color: #ffffff;
    }

    cds-button {
      border-left: 1px solid #ccc;
    }

    .weather-icon {
      width: 60px;
      height: 60px;
    }

    .weather-main {
      display: flex;
      align-items: center;
    }

    .no-content {
      width: 20%;
      font-size: 12px;
      text-align: center;
      display: flex;
      justify-content: center;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin: auto;
      margin-top: 150px;
    }
  `;

  // FUTURE: Allow users to copy "deep links" of their search results vs. constantly needing to download and send excels
  render() {
    return html`
      <div class="container">
        <cds-table is-sortable>
          <cds-table-header-title slot="title"
            >PEG Brain: Weather Finder</cds-table-header-title
          >
          ${this.toolBar} ${this.tableHead} ${this.tableBody}
        </cds-table>
      </div>
      ${this.noContent}
    `;
  }

  private get noContent() {
    if (this.weatherInfo.length !== 0) {
      return nothing;
    }

    return html`<p class="no-content"> No Weather Data. Start you search by Clicking 'Find Weather'</p>`;
  }

  private get toolBar() {
    return html` <cds-table-toolbar slot="toolbar">
      <cds-table-toolbar-content>
        <cds-table-toolbar-search
          placeholder="Filter on any attribute from any column"
        ></cds-table-toolbar-search>
      </cds-table-toolbar-content>
      <cds-button @click=${this.findWeatherClick}>Find Weather</cds-button>
      ${this.downloadCsvOption}
    </cds-table-toolbar>`;
  }

  // only show relevant options
  private get downloadCsvOption() {
    if (this.weatherInfo.length === 0) {
      return nothing;
    }

    return html`<cds-button @click=${this.handleDownload}> Download CSV </cds-button>`;
  }


  private get tableHead() {
    return html`
      <cds-table-head>
        <cds-table-header-row>
          ${[
            'Weather At',
            'Location',
            'Latitude & Longitutde',
            'Temperature (°F)',
            'Main Weather',
            'Description',
            'Raw API Response',
          ].map(
            header => html`
              <cds-table-header-cell>${header}</cds-table-header-cell>
            `
          )}
        </cds-table-header-row>
      </cds-table-head>
    `;
  }

  private get tableBody() {
    return html` <cds-table-body>
      ${this.weatherInfo.map(
        (item: WeatherInfo) => html`
          <cds-table-row>
            <cds-table-cell>${formatDateTime(item.timestamp)}</cds-table-cell>
            <cds-table-cell>${item.name}, ${item.country}</cds-table-cell>
            <cds-table-cell
              >${item.lat.toFixed(2)}, ${item.lon.toFixed(2)}</cds-table-cell
            >
            <cds-table-cell
              >${kelvinToFahrenheit(item.temperature)}</cds-table-cell
            >
            ${this.weatherMainDetails(item)}
            <cds-table-cell>${item.description}</cds-table-cell>
            <cds-table-cell>
              <button @click=${() => this.showRawApiResponse(item)}>
                View Json
              </button>
            </cds-table-cell>
          </cds-table-row>
        `
      )}
    </cds-table-body>`;
  }

  private weatherMainDetails(item: WeatherInfo) {
    const iconURL = `https://openweathermap.org/img/wn/${item.icon_code}@2x.png`;

    return html` <cds-table-cell>
      <div class="weather-main">
        <img class="weather-icon" src=${iconURL} />
        ${item.main_weather}
      </div>
    </cds-table-cell>`;
  }

  // IDEA: Future state: show in modal instead of new window. Add "copy to clipboard capability".
  private showRawApiResponse(item: WeatherInfo) {
    const rawApiResponseWindow = window.open('', '_blank', 'width=600,height=400');
    rawApiResponseWindow?.document.write(
      `<pre>${JSON.stringify(item.raw_api_response, null, 2)}</pre>`
    );
  }

  handleDownload() {
    downloadWeatherInfo(this.weatherInfo);
  }

  findWeatherClick() {
    this.dispatchEvent(new CustomEvent('findWeatherClicked'));
  }
}
