import pymongo
from matplotlib import pyplot as plt
from datetime import datetime
import pandas as pd
import sys
import json


def fetch_data_from_mongo(connection_string, db_name, collection_name):

    client = pymongo.MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]

    # Fetch all data from the collection
    data = list(collection.find())

    # Optional: Close the connection (optional since pymongo uses lazy connections)
    client.close()

    return data



connection_string = "https://url.us.m.mimecastprotect.com/s/qLfECXDlRktXoJ1gwu6f7CWq0zr?domain=mongodb+srv"
db_name = "Final01"
collection_name = "DataGroup2"
# Fetch the data
data = fetch_data_from_mongo(connection_string, db_name, collection_name)

thresholdUp = 28

# Convert the data into a pandas DataFrame
df = pd.DataFrame(data)
# Convert the 'date' column to datetime, handling the "Z" timezone marker
df['date'] = pd.to_datetime(df['date'])

# Extract the date (ignoring the time) for grouping
df['just_date'] = df['date'].dt.date

# Filter for rows where the value is greater than Threshold
df_filtered = df[df['value'] > thresholdUp]

# Group by the date and count how many times the value crossed Threshold each day
crossedThreshold = df_filtered.groupby('just_date').size()

# Convert the result into a list of date-value pairs (formatting date to 'YYYY-MM-DD')
date_value_pairs = [[d.strftime('%Y/%m/%d'), count] for d, count in crossedThreshold.items()]

# Print the result
print(date_value_pairs)


# Plotting
plt.figure(figsize=(10, 6))
crossedThreshold.plot(marker='.', linestyle='-')

# Adding labels and title
plt.xlabel('Date')
plt.ylabel('Number of anomalies')
plt.title('Number of anomalies per day')

# Show plot
plt.show()

date_value_pairs_json = json.dumps(date_value_pairs)

# Print the JSON string to stdout
print(date_value_pairs_json)

# Flush stdout to ensure the output is sent immediately
sys.stdout.flush()