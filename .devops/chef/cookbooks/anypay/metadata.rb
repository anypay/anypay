name 'anypay'
maintainer 'Anypay'
maintainer_email 'ops@anypayx.com'
license 'All Rights Reserved'
description 'Installs/Configures anypay'
long_description 'Installs/Configures anypay'
version '0.2.1'
chef_version '>= 12.1' if respond_to?(:chef_version)
supports 'ubuntu'

depends 'docker'
depends 'docker.anypayinc.com'

# The `issues_url` points to the location where issues for this cookbook are
# tracked.  A `View Issues` link will be displayed on this cookbook's page when
# uploaded to a Supermarket.
#
issues_url 'https://github.com/anypay/anypayissues'

# The `source_url` points to the development repository for this cookbook.  A
# `View Source` link will be displayed on this cookbook's page when uploaded to
# a Supermarket.
#
source_url 'https://github.com/anypay/anypay'
