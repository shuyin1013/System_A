import pandas as pd
import json

# 文件路径
input_excel_file = 'full_grouped.xlsx'
output_json_file = 'data.json'

# 读取Excel文件
df = pd.read_excel(input_excel_file)

# 确保数据按国家和日期排序
df = df.sort_values(by=['Country/Region', 'Date'])

# 将时间戳列转换为字符串格式
df['Date'] = df['Date'].astype(str)

# 将DataFrame转换为JSON格式
json_data = [
    {
        "Date": row["Date"],
        "name": row["Country/Region"],
        "Confirmed": int(row["Confirmed"]),
        "Deaths": int(row["Deaths"]),
        "Recovered": int(row["Recovered"]),
        "New_cases": int(row["New cases"]),
        "New_deaths": int(row["New deaths"]),
        "New_recovered": int(row["New recovered"])
    }
    for index, row in df.iterrows()
]

# 将JSON数据写入文件
with open(output_json_file, mode='w', encoding='utf-8') as json_file:
    json.dump(json_data, json_file, ensure_ascii=False, indent=4)
