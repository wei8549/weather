import { useEffect, useState } from 'react'
import style from './../styles/weather.module.scss'
import axios from 'axios'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

function Weather() {
  //全台天氣狀態
  const [locationWeather, setLocationWeather] = useState([])
  //新北市天氣資料
  const [newTaipei, setNewTaipei] = useState([])
  //使用者切換到地區天氣詳情
  const [selectLocation, setSelectLocation] = useState([])

  //透過axios方式取得全台天氣data
  const getWeatherData = async () => {
    const response = await axios.get(
      'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-85001E30-AF93-4B7B-AEEF-C98453EAAED6&format=JSON&elementName=MinT,MaxT,PoP12h,Wx,WeatherDescription'
    )
    setLocationWeather(response.data.records.locations[0].location)
    setNewTaipei(response.data.records.locations[0].location[3].weatherElement)
  }
  //使用者切換到地區的天氣data
  const getLocationWeather = async (e) => {
    const selLocation = e.target.value
    const response = await axios.get(
      'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-85001E30-AF93-4B7B-AEEF-C98453EAAED6&format=JSON&elementName=MinT,MaxT,PoP12h,Wx,WeatherDescription'
    )
    setSelectLocation(
      response.data.records.locations[0].location[selLocation].weatherElement
    )
    setWeek(0)
  }
  //切換日期
  const [week, setWeek] = useState(0)
  //加減日期function
  const Plus = () => {
    if (week < 12) {
      setWeek(week + 2)
    }
    return
  }
  const Minus = () => {
    if (week >= 2 && week <= 12) {
      setWeek(week - 2)
    }
    return
  }

  //中文星期對照
  const [chWeek, setChWeek] = useState([
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ])

  //天氣代碼
  const weatherTypes = {
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isSunny: [1, 2, 3],
    isCloudy: [4, 5, 6, 7, 24, 25, 26, 27, 28],
    isPartiallyClearWithRain: [
      8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39,
    ],
    isSnowing: [23, 37, 42],
  }
  //判斷回傳代碼是哪一種天氣圖示
  const [switchClick, setSwitchClick] = useState(true)

  const codeNewTaipei =
    newTaipei.length !== 0 && +newTaipei[1].time[week].elementValue[1].value
  const codeSelectLocation =
    selectLocation.length !== 0 &&
    +selectLocation[1].time[week].elementValue[1].value

  //新code or舊code
  const display = switchClick ? codeNewTaipei : codeSelectLocation
  const codeType = () => {
    if (weatherTypes.isThunderstorm.indexOf(display) !== -1) {
      return 'isPartiallyClearWithRain'
    } else if (weatherTypes.isSunny.indexOf(display) !== -1) {
      return 'isSunny'
    } else if (weatherTypes.isCloudy.indexOf(display) !== -1) {
      return 'isCloudy'
    } else if (weatherTypes.isPartiallyClearWithRain.indexOf(display) !== -1) {
      return 'isPartiallyClearWithRain'
    } else if (weatherTypes.isSnowing.indexOf(display) !== -1) {
      return 'isSnowing'
    }
  }

  useEffect(() => {
    getWeatherData()
  }, [])
  return (
    <>
      <div className={style.bgc}>
        <div className={style.description}>
          <h1>全台一週天氣預報</h1>
          <ul>
            <li>1・針對想了解地區天氣，於下拉選項切換</li>
            <li>2・提供清晨、傍晚最高及最低溫度</li>
            <li>3・降雨機率依據中央氣象局資料僅提供近三天資料</li>
          </ul>
        </div>

        <div className={style.WeatherCardWrapper}>
          <div className={style.date}>
            <div className={style.arrow} onClick={Minus}>
              <i className="fa-solid fa-chevron-left"></i>
            </div>
            <div className={style.dateWrap}>
              {/* 日期 */}
              {selectLocation.length === 0 ? (
                <span>
                  {newTaipei.length !== 0 &&
                    newTaipei[0].time[week].startTime.split(' ', 10)[0]}
                </span>
              ) : (
                <span>
                  {selectLocation.length !== 0 &&
                    selectLocation[0].time[week].startTime.split(' ', 10)[0]}
                </span>
              )}
              {/* 星期 */}
              {selectLocation.length === 0 ? (
                <span>
                  {newTaipei.length !== 0 &&
                    chWeek[
                      dayjs(
                        newTaipei[0].time[week].startTime.split(' ', 10)[0]
                      ).weekday()
                    ]}
                </span>
              ) : (
                <span>
                  {selectLocation.length !== 0 &&
                    chWeek[
                      dayjs(
                        selectLocation[0].time[week].startTime.split(' ', 10)[0]
                      ).weekday()
                    ]}
                </span>
              )}
            </div>
            <div className={style.arrow} onClick={Plus}>
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
          <div className={style.icon}>
            <img src={`/img/weather_icon/${codeType()}.png`} alt="" />
          </div>
          <div className={style.tempareature}>
            <div>
              <span>6:00</span>
              {selectLocation.length === 0 ? (
                <span>
                  {newTaipei.length !== 0 &&
                    newTaipei[2].time[week].elementValue[0].value}
                  -
                  {newTaipei.length !== 0 &&
                    newTaipei[4].time[week].elementValue[0].value}
                  °C
                </span>
              ) : (
                <span>
                  {selectLocation.length !== 0 &&
                    selectLocation[2].time[week].elementValue[0].value}
                  -
                  {selectLocation.length !== 0 &&
                    selectLocation[4].time[week].elementValue[0].value}
                  °C
                </span>
              )}
              <div className={style.rain}>
                <i className="fa-solid fa-umbrella"></i>
                {selectLocation.length === 0 ? (
                  <span>
                    {newTaipei.length !== 0 &&
                    newTaipei[0].time[week].elementValue[0].value === ' '
                      ? '未公布'
                      : newTaipei.length !== 0 &&
                        newTaipei[0].time[week].elementValue[0].value}
                    %
                  </span>
                ) : (
                  <span>
                    {selectLocation.length !== 0 &&
                    selectLocation[0].time[week].elementValue[0].value === ' '
                      ? '未公布'
                      : selectLocation.length !== 0 &&
                        selectLocation[0].time[week].elementValue[0].value}
                    %
                  </span>
                )}
              </div>
            </div>
            <div>
              <span>18:00</span>
              {selectLocation.length === 0 ? (
                <span>
                  {newTaipei.length !== 0 &&
                    newTaipei[2].time[week + 1].elementValue[0].value}
                  -
                  {newTaipei.length !== 0 &&
                    newTaipei[4].time[week + 1].elementValue[0].value}
                  °C
                </span>
              ) : (
                <span>
                  {selectLocation.length !== 0 &&
                    selectLocation[2].time[week + 1].elementValue[0].value}
                  -
                  {selectLocation.length !== 0 &&
                    selectLocation[4].time[week + 1].elementValue[0].value}
                  °C
                </span>
              )}
              <div className={style.rain}>
                <i className="fa-solid fa-umbrella"></i>
                {selectLocation.length === 0 ? (
                  <span>
                    {newTaipei.length !== 0 &&
                    newTaipei[0].time[week + 1].elementValue[0].value === ' '
                      ? '未公布'
                      : newTaipei.length !== 0 &&
                        newTaipei[0].time[week + 1].elementValue[0].value}
                    %
                  </span>
                ) : (
                  <span>
                    {selectLocation.length !== 0 &&
                    selectLocation[0].time[week + 1].elementValue[0].value ===
                      ' '
                      ? '未公布'
                      : selectLocation.length !== 0 &&
                        selectLocation[0].time[week + 1].elementValue[0].value}
                    %
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={style.weatherStatus}>
            {selectLocation.length === 0 ? (
              <span>
                {newTaipei.length !== 0 &&
                  newTaipei[1].time[week].elementValue[0].value}
              </span>
            ) : (
              <span>
                {selectLocation.length !== 0 &&
                  selectLocation[1].time[week].elementValue[0].value}
              </span>
            )}
          </div>
          <div className={style.locationSelect}>
            <select
              onChange={(e) => {
                getLocationWeather(e)
                if (switchClick) {
                  setSwitchClick(false)
                }
              }}
            >
              <option>{newTaipei.length !== 0 && '新北市'}</option>
              {locationWeather.map((v, i) => {
                return (
                  <option key={i} value={i}>
                    {v.locationName}
                  </option>
                )
              })}
            </select>
          </div>
          <h5>資料來源：中央氣象局</h5>
        </div>
       
      </div>
      <img src="./weather/img/cloud1.png" alt="" className={style.cloud1} />
      <img src="./weather/img/cloud1.png" alt="" className={style.cloud2} />
      <img src="./weather/img/cloud1.png" alt="" className={style.cloud3} />
      <img src="./weather/img/cloud2.png" alt="" className={style.cloud4} />
    </>
  )
}

export default Weather
