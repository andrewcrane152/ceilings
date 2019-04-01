# config valid only for current version of Capistrano
lock "3.9.0"

set :application, "ceilings.3-form.com"
set :repo_url, "git@github.com:3-form/ceilings.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_dirs, fetch(:linked_dirs, []).push('node_modules')

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :deploy do
  desc "run npm install"
  task :npm_install do
    on roles(:web) do
      execute "cd #{release_path} && npm install"
    end
  end

  desc "build the app"
  task :ng_build do
    on roles(:production) do
      print "building in production environment"
      execute "cd #{release_path} && ng build --configuration=production --no-progress"
    end

    on roles(:staging) do
      print "building in staging environment"
      execute "cd #{release_path} && ng build --configuration=staging --no-progress"
    end

    on roles(:alpha) do
      print "building in staging environment"
      execute "cd #{release_path} && ng build --configuration=development --no-progress"
    end
  end

  # desc "precache files with sw-precache"
  # task :precache do
  #   on roles(:web) do
  #     execute "cd #{release_path} && npm run precache"
  #   end
  # end

  desc "display angular version"
  task :ng_version do
    on roles(:web) do
      execute "cd #{release_path} && ng -v"
    end
  end

  after "updating", "deploy:npm_install"
  after "updating", "deploy:ng_version"
  after "updating", "deploy:ng_build"
  # after "updating", "deploy:precache"
end
