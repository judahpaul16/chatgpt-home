# 🏠 GPT Home
ChatGPT at home! Basically a better G**gle Nest Hub desk assistant made with Raspberry Pi and OpenAI API.

## 📜 Example Reclone script:
First initialize an environment variable with your OpenAI API Key.
```bash
export OPENAI_API_KEY="your_openai_api_key_here"
```
Then create a script outside the local repo folder to reclone the repo and start the service.
```bash
#!/bin/bash

# Remove existing local repo if it exists
if [ -d "gpt-home" ]; then
    rm -rf gpt-home
fi

# Clone the GitHub repo
git clone https://github.com/judahpaul16/gpt-home.git

# Navigate to root of the local repo
cd gpt-home

# Create a virtual environment
python3 -m venv env

# Activate the virtual environment
source env/bin/activate

# Install Python dependencies
pip install --use-pep517 -r requirements.txt

# Define the name of the systemd service
SERVICE_NAME="gpt-home.service"

# Check if the systemd service already exists, recreate it if it does
if [ -f "/etc/systemd/system/$SERVICE_NAME" ]; then
    sudo systemctl stop "$SERVICE_NAME"
fi

echo "Creating and enabling systemd service $SERVICE_NAME..."

# Create a systemd service unit file
cat <<EOF | sudo tee "/etc/systemd/system/$SERVICE_NAME" >/dev/null
[Unit]
Description=ChatGPT Home
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/gpt-home
ExecStart=/home/ubuntu/gpt-home/env/bin/python /home/ubuntu/gpt-home/app.py
Environment="OPENAI_API_KEY=$OPENAI_API_KEY"
Restart=always
Type=simple

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
sudo systemctl daemon-reload

# Enable the service
sudo systemctl enable "$SERVICE_NAME"

echo "Systemd service $SERVICE_NAME created and enabled."

# Start the service
sudo systemctl restart "$SERVICE_NAME"
echo ""
sudo systemctl status "$SERVICE_NAME"
```
Be sure to make the script executable to run it
```bash
chmod +x reclone.sh
./reclone.sh
```

---

## ⚠️ Schematics / Wiring Diagram
### Caution: Battery Connection
**IMPORTANT**: Before connecting the battery, ensure that the polarity is correct to avoid damage to your Raspberry Pi or other components. Disconnect power sources before making changes.

![Schematics](schematic_bb.png)  
---
![Schematics](schematic_schem.png)  
---
![My Build](my_build.jpg)  

---

## 🛠 My Parts List

### Core Components
- **Raspberry Pi 4B**: [Link](https://a.co/d/aH6YCXY) - $50-$70
- **Mini Speaker**: [Link](https://a.co/d/9bN8LZ2) - $18
- **128x32 OLED Display**: [Link](https://a.co/d/4Scrfjq) - $13-$14
- **128 GB MicroSD card**: [Link](https://a.co/d/0SxSg7O) - $13
- **USB 2.0 Mini Microphone**: [Link](https://a.co/d/eIrQUXC) - $8

---

### 🌟 Optional Components
- **Standoff Spacer Column M3x40mm**: [Link](https://a.co/d/ees6oEA) - $14
- **M1.4 M1.7 M2 M2.5 M3 Screw Kit**: [Link](https://a.co/d/4XJwiBY) - $15
- **Raspberry Pi UPS Power Supply with Battery**: [Link](https://a.co/d/1rMMCPR) - $30
- **Cool Case for Raspberry Pi 4B**: [Link](https://a.co/d/idSKJIG) - $16

---

## 💲 Total Price Range
- **Core Components**: $102-$123
- **Optional Components**: $75
- **Total (Without Optional)**: $102-$123
- **Total (With Optional)**: $177-$198

---

## 📚 Useful Documentation
- [Raspberry Pi Docs](https://www.raspberrypi.com/documentation)
- [GPIO Pinout](https://www.raspberrypi.com/documentation/computers/images/GPIO-Pinout-Diagram-2.png)
- [OpenAI API Docs](https://beta.openai.com/docs/introduction)
- [SpeechRecognition Docs](https://pypi.org/project/SpeechRecognition/)
- [pyttsx3 Docs](https://pypi.org/project/pyttsx3/)
- [Requests Docs](https://pypi.org/project/requests/)
- [PortAudio Docs](http://www.portaudio.com/docs/v19-doxydocs/index.html)
- [Python3 Docs](https://docs.python.org/3/)
- [Fritzing Schematics](https://fritzing.org/)
