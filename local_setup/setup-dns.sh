#!/bin/bash

# DNS Setup Script for Multi-Tenant System
# This script helps set up local DNS entries for development

echo "🌐 DNS Setup for Multi-Tenant System"
echo "===================================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Detected macOS"
    echo ""
    echo "To set up local DNS for development, add these entries to /etc/hosts:"
    echo ""
    echo "# Multi-Tenant System - Development"
    echo "127.0.0.1 rent.mornscience.com"
    echo "127.0.0.1 job.mornscience.com"
    echo "127.0.0.1 social.mornscience.com"
    echo "127.0.0.1 deepfake-detector.mornscience.com"
    echo "127.0.0.1 vpn.mornscience.com"
    echo ""
    echo "Run this command to add the entries:"
    echo "sudo sh -c 'echo \"# Multi-Tenant System - Development\" >> /etc/hosts && echo \"127.0.0.1 rent.mornscience.com\" >> /etc/hosts && echo \"127.0.0.1 job.mornscience.com\" >> /etc/hosts && echo \"127.0.0.1 social.mornscience.com\" >> /etc/hosts && echo \"127.0.0.1 deepfake-detector.mornscience.com\" >> /etc/hosts && echo \"127.0.0.1 vpn.mornscience.com\" >> /etc/hosts'"
    echo ""
    echo "After adding the entries, you can access:"
    echo "• MornRent: http://rent.mornscience.com:3001"
    echo "• MornJob: http://job.mornscience.com:3001"
    echo "• MornSocial: http://social.mornscience.com:3001"
    echo "• Deepfake Detector: http://deepfake-detector.mornscience.com:3001"
    echo "• MornVPN: http://vpn.mornscience.com:3001"
else
    echo "🖥️  For other operating systems, add these entries to your hosts file:"
    echo ""
    echo "# Multi-Tenant System - Development"
    echo "127.0.0.1 rent.mornscience.com"
    echo "127.0.0.1 job.mornscience.com"
    echo "127.0.0.1 social.mornscience.com"
    echo "127.0.0.1 deepfake-detector.mornscience.com"
    echo "127.0.0.1 vpn.mornscience.com"
fi

echo ""
echo "📋 Current DNS Configuration:"
echo "============================="
echo "rent.mornscience.com -> rent"
echo "job.mornscience.com -> job"
echo "social.mornscience.com -> social"
echo "deepfake-detector.mornscience.com -> deepfake_detector"
echo "vpn.mornscience.com -> vpn" 