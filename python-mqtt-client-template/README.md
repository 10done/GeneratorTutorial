# Python MQTT Client Template

An AsyncAPI generator template that produces a Python MQTT client from an AsyncAPI document. Built as part of the [AsyncAPI Generator Template tutorial](https://www.asyncapi.com/docs/tools/generator/generator-template).

## What it does

Given an AsyncAPI document, this template generates a Python file (`client.py`) that:
- Connects to an MQTT broker defined in the AsyncAPI document
- Exposes a method for each `receive` operation defined in the document

The example AsyncAPI document models a **Temperature Service** that notifies when a bedroom temperature drops or rises past 22°C.

## Project structure

```
python-mqtt-client-template/
├── components/
│   └── TopicFunction.js     # Reusable component — generates publish methods
├── template/
│   └── index.js             # Main template using React render engine
├── test/
│   ├── fixtures/
│   │   └── asyncapi.yml     # AsyncAPI document (input to the generator)
│   └── project/
│       └── test.py          # Script to test the generated client
└── package.json
```

## Prerequisites

- Node.js & npm
- Python 3
- Docker (for the local MQTT broker)
- AsyncAPI CLI

```bash
npm install -g @asyncapi/cli
pip3 install paho-mqtt==1.6.1
```

## Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/10done/GeneratorTutorial.git
cd GeneratorTutorial/python-mqtt-client-template
npm install
```

Start a local MQTT broker:

```bash
docker run -d --name mosquitto -p 1883:1883 eclipse-mosquitto
```

## Usage

### Generate the Python client

```bash
asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ --output test/project --force-write --param server=dev
```

This reads `test/fixtures/asyncapi.yml` and produces `test/project/client.py`.

### Run the test script

```bash
python3 test/project/test.py
```

Expected output:

```
Temperature drop detected 25044483 sent to temperature/dropped
Temperature rise detected 25044483 sent to temperature/risen
Temperature drop detected 29357710 sent to temperature/dropped
Temperature rise detected 29357710 sent to temperature/risen
...
```

Press `Ctrl+C` to stop.

### Run everything with one command

```bash
npm test
```

This runs `test:clean` → `test:generate` → `test:start` in sequence.

## How the template works

`template/index.js` uses the [AsyncAPI React render engine](https://www.asyncapi.com/docs/tools/generator/react-render-engine) to generate `client.py`. It reads values directly from the parsed AsyncAPI document:

- `asyncapi.servers().get(params.server).host()` — broker URL from the `servers` section
- `asyncapi.info().title()` — class name from the `info` section
- `asyncapi.operations().filterByReceive()` — operations to generate publish methods for

The `components/TopicFunction.js` component iterates over all `receive` operations and generates one `send` method per operation, using the operation's channel address as the topic.

## Template parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `server`  | Yes      | Server name from the AsyncAPI document to use as the broker (e.g. `dev`) |
