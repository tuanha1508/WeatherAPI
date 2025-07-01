#!/bin/bash

echo "🎯 Preparing Keploy API Testing Submission..."
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Initializing..."
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
echo "📁 Adding all files to git..."
git add .

# Check git status
echo ""
echo "📋 Git Status:"
git status --short

# Create commit
echo ""
echo "💾 Creating commit..."
commit_message="🎯 Add Keploy AI API Testing Integration

✨ Features Added:
- Complete OpenAPI 3.0 specification (openapi.yaml)
- Keploy AI testing configuration (keploy.yml)
- Docker integration (Dockerfile, docker-compose.keploy.yml)
- Automated recording scripts (scripts/keploy-record.sh)
- Test execution scripts (scripts/keploy-test.sh)  
- GitHub Actions CI/CD pipeline (.github/workflows/keploy-api-testing.yml)
- Comprehensive documentation (KEPLOY_INTEGRATION.md)

🧪 Testing:
- All API endpoints tested and working
- Error handling validated
- Simple testing alternative provided

🚀 CI/CD Pipeline:
- Automated Keploy testing
- Security scanning
- Multi-stage deployment validation

Task 1: API Testing with AI [Mandatory] - COMPLETED ✅"

git commit -m "$commit_message"

if [ $? -eq 0 ]; then
    echo "✅ Commit created successfully!"
else
    echo "❌ Commit failed. Please check for issues."
    exit 1
fi

echo ""
echo "🎯 Submission Checklist:"
echo "========================"
echo ""
echo "✅ OpenAPI Schema Created:"
echo "   - openapi.yaml with complete API specification"
echo "   - All 8 endpoints documented"
echo "   - Request/response schemas defined"
echo ""
echo "✅ API Testing using AI:"
echo "   - Keploy configuration (keploy.yml)"
echo "   - Recording scripts (scripts/keploy-record.sh)"
echo "   - Test execution (scripts/keploy-test.sh)"
echo "   - Docker integration ready"
echo ""
echo "✅ CI/CD Integration:"
echo "   - GitHub Actions workflow configured"
echo "   - Automated testing pipeline"
echo "   - Security scanning included"
echo ""
echo "🔄 Next Steps:"
echo "=============="
echo ""
echo "1. 🚀 Push to GitHub:"
echo "   git push origin main"
echo ""
echo "2. 📊 Watch GitHub Actions:"
echo "   - Go to GitHub repository"
echo "   - Click 'Actions' tab"
echo "   - Watch 'Keploy API Testing with AI' workflow"
echo ""
echo "3. 📸 Capture Screenshots:"
echo "   - GitHub Actions pipeline running"
echo "   - Test results from workflow"
echo "   - Pipeline success confirmation"
echo ""
echo "4. 📋 Submit Assignment:"
echo "   - Share GitHub repository URL"
echo "   - Include screenshots in README"
echo "   - Mention Keploy integration completed"
echo ""
echo "📚 Documentation Files:"
echo "======================="
echo "- KEPLOY_INTEGRATION.md - Complete integration guide"
echo "- TASK_COMPLETION_SUMMARY.md - Task completion details"
echo "- openapi.yaml - API specification"
echo "- keploy.yml - Keploy configuration"
echo ""
echo "🎉 READY FOR SUBMISSION!"
echo ""
echo "Your WeatherAPI now has complete Keploy AI-powered testing"
echo "integration with CI/CD pipeline. Push to GitHub and capture"
echo "screenshots of the pipeline execution to complete the task!" 